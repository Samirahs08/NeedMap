// ─── Mock data for the NeedMap Dashboard ────────────────────────────

export const metricsData = {
  activeNeeds: 47,
  criticalNeeds: 14,
  availableVolunteers: 23,
  totalVolunteers: 68,
  assignmentsToday: 12,
  completedToday: 7,
  inProgressToday: 5,
  avgResponseTime: { hours: 1, minutes: 34 },
  avgResponseLastWeek: { hours: 1, minutes: 52 },
}

export const alertBanner = {
  show: true,
  message:
    'Seasonal alert: Zone 4 historically reports flood needs in this month. Consider pre-assigning 5 volunteers to this area.',
}

// ─── Map Needs (plotted on Leaflet) ──────────────────────────────────
export const mapNeeds = [
  { id: 1, title: 'Medical emergency — shortage of first-aid kits', zone: 'Zone 7', lat: 19.076, lng: 72.8777, urgency: 92, reports: 14, volunteersAssigned: 1, category: 'Medical' },
  { id: 2, title: 'Food distribution disrupted', zone: 'Ward 2', lat: 19.06, lng: 72.855, urgency: 85, reports: 9, volunteersAssigned: 0, category: 'Food' },
  { id: 3, title: 'Temporary shelter collapse risk', zone: 'Zone 3', lat: 19.095, lng: 72.87, urgency: 78, reports: 7, volunteersAssigned: 2, category: 'Shelter' },
  { id: 4, title: 'Water purification supplies needed', zone: 'Zone 5', lat: 19.05, lng: 72.89, urgency: 71, reports: 5, volunteersAssigned: 1, category: 'Water' },
  { id: 5, title: 'Mental health support request', zone: 'Zone 1', lat: 19.085, lng: 72.835, urgency: 64, reports: 3, volunteersAssigned: 0, category: 'Health' },
  { id: 6, title: 'Clothing drive — winter supplies low', zone: 'Zone 8', lat: 19.11, lng: 72.91, urgency: 55, reports: 4, volunteersAssigned: 1, category: 'Supplies' },
  { id: 7, title: 'Road access blocked — debris', zone: 'Zone 6', lat: 19.04, lng: 72.86, urgency: 48, reports: 2, volunteersAssigned: 2, category: 'Infrastructure' },
  { id: 8, title: 'Sanitation maintenance — Ward 5', zone: 'Ward 5', lat: 19.065, lng: 72.905, urgency: 35, reports: 2, volunteersAssigned: 3, category: 'Sanitation' },
  { id: 9, title: 'Education kit delivery pending', zone: 'Zone 2', lat: 19.1, lng: 72.845, urgency: 28, reports: 1, volunteersAssigned: 1, category: 'Education' },
  { id: 10, title: 'Volunteer transport arrangement', zone: 'Zone 9', lat: 19.03, lng: 72.84, urgency: 20, reports: 1, volunteersAssigned: 2, category: 'Logistics' },
]

// ─── Activity feed ───────────────────────────────────────────────────
export const activityFeed = [
  { id: 1, time: '2 mins ago', type: 'critical', text: 'New need logged: Medical emergency in Zone 7' },
  { id: 2, time: '5 mins ago', type: 'volunteer', text: 'Volunteer Ravi Kumar accepted assignment in Zone 4' },
  { id: 3, time: '8 mins ago', type: 'critical', text: 'Urgency score updated: Food distribution Ward 2 → 85' },
  { id: 4, time: '12 mins ago', type: 'resolved', text: 'Need resolved: Food distribution Ward 2' },
  { id: 5, time: '18 mins ago', type: 'volunteer', text: 'Volunteer Priya Sharma checked in at Zone 3' },
  { id: 6, time: '25 mins ago', type: 'info', text: 'Field report received from worker +91 98765 43210' },
  { id: 7, time: '32 mins ago', type: 'volunteer', text: 'Volunteer Amit Patel completed assignment in Zone 1' },
  { id: 8, time: '40 mins ago', type: 'critical', text: 'New critical need: Shelter collapse risk Zone 3' },
  { id: 9, time: '48 mins ago', type: 'resolved', text: 'Need resolved: Water supply restored Ward 4' },
  { id: 10, time: '55 mins ago', type: 'volunteer', text: 'Volunteer Sneha Gupta set status to Available' },
  { id: 11, time: '1 hour ago', type: 'info', text: 'Field report received from worker +91 98765 43210' },
  { id: 12, time: '1 hour ago', type: 'volunteer', text: 'Volunteer Deepak Joshi started transit to Zone 5' },
  { id: 13, time: '1.5 hours ago', type: 'resolved', text: 'Need resolved: Road clearance Zone 6 completed' },
  { id: 14, time: '2 hours ago', type: 'critical', text: 'Urgency escalation: Mental health support Zone 1' },
  { id: 15, time: '2.5 hours ago', type: 'info', text: 'System auto-refresh completed — 3 scores recalculated' },
]

// ─── Top urgent needs ────────────────────────────────────────────────
export const topUrgentNeeds = [
  { id: 1, title: 'Medical emergency — Zone 7', zone: 'Zone 7', urgency: 92, badge: 'CRITICAL' },
  { id: 2, title: 'Food distribution disrupted', zone: 'Ward 2', urgency: 85, badge: 'CRITICAL' },
  { id: 3, title: 'Shelter collapse risk', zone: 'Zone 3', urgency: 78, badge: 'HIGH' },
  { id: 4, title: 'Water purification supplies', zone: 'Zone 5', urgency: 71, badge: 'HIGH' },
  { id: 5, title: 'Mental health support', zone: 'Zone 1', urgency: 64, badge: 'MEDIUM' },
]

// ─── Volunteers ──────────────────────────────────────────────────────
export const volunteers = {
  available: [
    { id: 1, name: 'Sneha Gupta', initials: 'SG', skills: ['Medical', 'First Aid'], status: 'Available', distance: '2.3 km' },
    { id: 2, name: 'Arjun Mehta', initials: 'AM', skills: ['Transport', 'Logistics'], status: 'Available', distance: '1.1 km' },
    { id: 3, name: 'Fatima Khan', initials: 'FK', skills: ['Counseling', 'Health'], status: 'Available', distance: '3.5 km' },
    { id: 4, name: 'Raj Patel', initials: 'RP', skills: ['Food', 'Distribution'], status: 'Available', distance: '0.8 km' },
    { id: 5, name: 'Meera Iyer', initials: 'MI', skills: ['Education', 'Children'], status: 'Available', distance: '4.2 km' },
  ],
  assigned: [
    { id: 6, name: 'Ravi Kumar', initials: 'RK', skills: ['Construction', 'Shelter'], status: 'On Assignment — Zone 4' },
    { id: 7, name: 'Priya Sharma', initials: 'PS', skills: ['Medical', 'Nursing'], status: 'On Assignment — Zone 3' },
    { id: 8, name: 'Deepak Joshi', initials: 'DJ', skills: ['Water', 'Sanitation'], status: 'In Transit — Zone 5' },
    { id: 9, name: 'Anita Das', initials: 'AD', skills: ['Food', 'Cooking'], status: 'On Assignment — Ward 2' },
    { id: 10, name: 'Vikram Singh', initials: 'VS', skills: ['Security', 'Patrol'], status: 'On Assignment — Zone 7' },
  ],
  rest: [
    { id: 11, name: 'Amit Patel', initials: 'AP', skills: ['Transport', 'Driving'], status: 'Rest — back at 4:00 PM' },
    { id: 12, name: 'Kavya Nair', initials: 'KN', skills: ['Medical', 'Surgery'], status: 'Rest — back tomorrow' },
    { id: 13, name: 'Rohit Yadav', initials: 'RY', skills: ['Construction'], status: 'Rest — back at 6:00 PM' },
  ],
}

// ─── Best matched volunteers (for assignment modal) ──────────────────
export const bestMatchedVolunteers = [
  { id: 1, name: 'Sneha Gupta', initials: 'SG', matchPercent: 96, distance: '2.3 km', skills: ['Medical', 'First Aid'], availability: 'Available now' },
  { id: 2, name: 'Fatima Khan', initials: 'FK', matchPercent: 89, distance: '3.5 km', skills: ['Counseling', 'Health'], availability: 'Available now' },
  { id: 4, name: 'Raj Patel', initials: 'RP', matchPercent: 74, distance: '0.8 km', skills: ['Food', 'Distribution'], availability: 'Available now' },
  { id: 3, name: 'Arjun Mehta', initials: 'AM', matchPercent: 62, distance: '1.1 km', skills: ['Transport', 'Logistics'], availability: 'Available now' },
  { id: 5, name: 'Meera Iyer', initials: 'MI', matchPercent: 51, distance: '4.2 km', skills: ['Education', 'Children'], availability: 'Available now' },
]
