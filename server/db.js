// ─── In-Memory Database (replace with MongoDB/PostgreSQL in production) ───
// Stores needs, volunteers, assignments, and message logs

const db = {
  needs: [],
  volunteers: [
    { id: 1, name: 'Sneha Gupta', phone: '+919876543210', skills: ['Medical','First Aid'], homeZone: 'Zone 1', status: 'Available', weeklyLimit: 20, hoursUsed: 4, matchScore: 92, responseRate: 95, lat: 19.076, lng: 72.877 },
    { id: 2, name: 'Arjun Mehta', phone: '+919876543211', skills: ['Transport','Logistics'], homeZone: 'Zone 2', status: 'Available', weeklyLimit: 25, hoursUsed: 8, matchScore: 88, responseRate: 90, lat: 19.082, lng: 72.890 },
    { id: 3, name: 'Fatima Khan', phone: '+919876543212', skills: ['Food Distribution','Counseling'], homeZone: 'Zone 3', status: 'Available', weeklyLimit: 20, hoursUsed: 2, matchScore: 85, responseRate: 88, lat: 19.065, lng: 72.860 },
    { id: 4, name: 'Raj Patel', phone: '+919876543213', skills: ['Construction','Shelter'], homeZone: 'Zone 4', status: 'Available', weeklyLimit: 30, hoursUsed: 12, matchScore: 78, responseRate: 82, lat: 19.090, lng: 72.900 },
    { id: 5, name: 'Meera Iyer', phone: '+919876543214', skills: ['Education','Child Care'], homeZone: 'Zone 5', status: 'Available', weeklyLimit: 15, hoursUsed: 6, matchScore: 75, responseRate: 80, lat: 19.055, lng: 72.845 },
  ],
  assignments: [],
  messageLogs: [],
  needIdCounter: 1,
  assignmentIdCounter: 1,
}

// ─── Need Operations ─────────────────────────
export function createNeed(data) {
  const need = {
    id: `N-${String(db.needIdCounter++).padStart(4, '0')}`,
    title: data.title || 'Community reported need',
    category: data.category || 'General',
    zone: data.zone || 'Unknown',
    location: data.location || '',
    description: data.description || '',
    peopleAffected: data.peopleAffected || 0,
    urgency: data.urgency || 50,
    severity: data.severity || 3,
    status: 'Active',
    source: data.source || 'WhatsApp',
    reporterPhone: data.reporterPhone || '',
    createdAt: new Date().toISOString(),
    volunteersAssigned: 0,
    volunteersNeeded: data.volunteersNeeded || 2,
  }
  db.needs.push(need)
  console.log(`[DB] Need created: ${need.id} — ${need.title} (urgency: ${need.urgency})`)
  return need
}

export function getNeedById(id) {
  return db.needs.find(n => n.id === id)
}

export function updateNeed(id, updates) {
  const idx = db.needs.findIndex(n => n.id === id)
  if (idx >= 0) { db.needs[idx] = { ...db.needs[idx], ...updates }; return db.needs[idx] }
  return null
}

// ─── Volunteer Operations ─────────────────────
export function findVolunteerByPhone(phone) {
  const cleaned = phone.replace(/\D/g, '').slice(-10)
  return db.volunteers.find(v => v.phone.replace(/\D/g, '').slice(-10) === cleaned)
}

export function getAvailableVolunteers() {
  return db.volunteers.filter(v => v.status === 'Available' && v.hoursUsed < v.weeklyLimit)
}

export function updateVolunteer(id, updates) {
  const idx = db.volunteers.findIndex(v => v.id === id)
  if (idx >= 0) { db.volunteers[idx] = { ...db.volunteers[idx], ...updates }; return db.volunteers[idx] }
  return null
}

// ─── Assignment Operations ─────────────────────
export function createAssignment(needId, volunteerId) {
  const need = getNeedById(needId)
  const vol = db.volunteers.find(v => v.id === volunteerId)
  if (!need || !vol) return null

  const assignment = {
    id: `A-${String(db.assignmentIdCounter++).padStart(4, '0')}`,
    needId, volunteerId,
    volunteerName: vol.name,
    volunteerPhone: vol.phone,
    needTitle: need.title,
    zone: need.zone,
    status: 'Notified', // Notified → Accepted → OnSite → Completed
    notifiedAt: new Date().toISOString(),
    acceptedAt: null,
    onSiteAt: null,
    completedAt: null,
    declinedVolunteers: [],
    escalated: false,
    reminderSent: false,
  }
  db.assignments.push(assignment)
  updateVolunteer(volunteerId, { status: 'Assigned' })
  updateNeed(needId, { volunteersAssigned: need.volunteersAssigned + 1 })
  console.log(`[DB] Assignment created: ${assignment.id} — ${vol.name} → ${need.title}`)
  return assignment
}

export function findPendingAssignment(volunteerPhone) {
  const vol = findVolunteerByPhone(volunteerPhone)
  if (!vol) return null
  return db.assignments.find(a => a.volunteerId === vol.id && ['Notified', 'Accepted', 'OnSite'].includes(a.status))
}

export function updateAssignment(id, updates) {
  const idx = db.assignments.findIndex(a => a.id === id)
  if (idx >= 0) { db.assignments[idx] = { ...db.assignments[idx], ...updates }; return db.assignments[idx] }
  return null
}

export function getTimedOutAssignments(minutesThreshold) {
  const cutoff = new Date(Date.now() - minutesThreshold * 60000)
  return db.assignments.filter(a =>
    a.status === 'Notified' &&
    !a.reminderSent &&
    new Date(a.notifiedAt) < cutoff
  )
}

export function getReminderExpiredAssignments(minutesThreshold) {
  const cutoff = new Date(Date.now() - minutesThreshold * 60000)
  return db.assignments.filter(a =>
    a.status === 'Notified' &&
    a.reminderSent &&
    new Date(a.notifiedAt) < cutoff
  )
}

// ─── Message Log ─────────────────────
export function logMessage(from, to, body, direction) {
  db.messageLogs.push({ from, to, body, direction, timestamp: new Date().toISOString() })
}

export function getAllData() { return db }
