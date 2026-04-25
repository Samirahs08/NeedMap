import { db } from './firebase';
import {
  collection, doc, getDocs, addDoc, setDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp, Timestamp
} from 'firebase/firestore';

// ─── Constants ────────────────────────────────────────────────────────
export const categoriesList = ['Medical', 'Food', 'Flood Relief', 'Sanitation', 'Education', 'Elder Care', 'Child Care', 'Shelter'];
export const zonesList = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
export const statusesList = ['Active', 'Assigned', 'In Progress', 'Resolved'];
export const sourcesList = ['WhatsApp', 'Manual', 'Email', 'Field Visit', 'Phone Call'];
export const skillsList = ['Medical','First Aid','Counseling','Transport','Logistics','Food Distribution','Construction','Shelter','Water & Sanitation','Education','Child Care','Elder Care','Translation','Communication','Security'];
export const languagesList = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Urdu', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];
export const daysList = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// ─── Demo Needs Data ──────────────────────────────────────────────────
const DEMO_NEEDS = [
  {
    title: 'Medical emergency — first-aid shortage in Zone 7',
    category: 'Medical',
    zone: 'Zone 7',
    urgency: 92,
    reports: 14,
    volunteersAssigned: 1,
    volunteersNeeded: 3,
    status: 'Active',
    source: 'WhatsApp',
    peopleAffected: 120,
    description: 'Multiple community members in Zone 7 have reported a severe shortage of first-aid kits and basic medical supplies. The local health center is overwhelmed and cannot keep up with demand. Immediate restocking and volunteer medical support needed.',
    severity: 5,
    frequency: 4,
    recency: 5,
    coverage: 2,
    isDemo: true,
  },
  {
    title: 'Food distribution disrupted at Ward 2 relief center',
    category: 'Food',
    zone: 'Ward 2',
    urgency: 78,
    reports: 9,
    volunteersAssigned: 0,
    volunteersNeeded: 4,
    status: 'Active',
    source: 'Field Visit',
    peopleAffected: 250,
    description: 'The food distribution point at Ward 2 has been disrupted due to supply chain delays. Over 250 families depend on this center for daily meals. Volunteers are needed to coordinate alternative distribution from the backup warehouse.',
    severity: 4,
    frequency: 3,
    recency: 4,
    coverage: 3,
    isDemo: true,
  },
  {
    title: 'Temporary shelter collapse risk in Zone 3',
    category: 'Shelter',
    zone: 'Zone 3',
    urgency: 65,
    reports: 7,
    volunteersAssigned: 2,
    volunteersNeeded: 3,
    status: 'In Progress',
    source: 'Phone Call',
    peopleAffected: 85,
    description: 'Structural assessment of temporary shelters in Zone 3 indicates risk of collapse in 4 shelters housing approximately 85 people. Reinforcement materials and construction-skilled volunteers required urgently.',
    severity: 4,
    frequency: 2,
    recency: 3,
    coverage: 2,
    isDemo: true,
  },
];

// ─── Demo Volunteers ──────────────────────────────────────────────────
const DEMO_VOLUNTEERS = [
  {
    name: 'Sneha Gupta', initials: 'SG',
    phone: '+91 98765 43210',
    skills: [{ name: 'Medical', level: 'Expert' }, { name: 'First Aid', level: 'Trained' }, { name: 'Counseling', level: 'Basic' }],
    homeZone: 'Zone 7', languages: ['Hindi', 'English', 'Marathi'],
    status: 'Available', weeklyLimit: 25, hoursUsed: 12,
    totalAssignments: 67, completedAssignments: 58, completionRate: 87,
    joined: '2025-08-15',
    availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availabilityHours: '9:00 — 18:00',
    coverageRadius: '3.2 km', distance: '2.3 km',
    performance: { score: 91, responseRate: 94, completionRate: 87, onTimeRate: 89, feedbackScore: 93 },
    matchScore: 96, isDemo: true,
  },
  {
    name: 'Arjun Mehta', initials: 'AM',
    phone: '+91 87654 32109',
    skills: [{ name: 'Transport', level: 'Expert' }, { name: 'Logistics', level: 'Trained' }],
    homeZone: 'Zone 4', languages: ['Hindi', 'Gujarati'],
    status: 'Assigned', weeklyLimit: 20, hoursUsed: 18,
    totalAssignments: 45, completedAssignments: 39, completionRate: 87,
    joined: '2025-11-02',
    availabilityDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    availabilityHours: '8:00 — 17:00',
    coverageRadius: '4.8 km', distance: '1.1 km',
    performance: { score: 85, responseRate: 88, completionRate: 87, onTimeRate: 82, feedbackScore: 84 },
    matchScore: 89, isDemo: true,
  },
  {
    name: 'Fatima Khan', initials: 'FK',
    phone: '+91 76543 21098',
    skills: [{ name: 'Counseling', level: 'Expert' }, { name: 'Education', level: 'Trained' }, { name: 'Translation', level: 'Trained' }],
    homeZone: 'Zone 1', languages: ['Hindi', 'English', 'Urdu'],
    status: 'Available', weeklyLimit: 22, hoursUsed: 8,
    totalAssignments: 34, completedAssignments: 31, completionRate: 91,
    joined: '2026-01-10',
    availabilityDays: ['Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
    availabilityHours: '10:00 — 19:00',
    coverageRadius: '5.0 km', distance: '3.5 km',
    performance: { score: 89, responseRate: 92, completionRate: 91, onTimeRate: 86, feedbackScore: 88 },
    matchScore: 82, isDemo: true,
  },
];

// ─── Demo Assignments ─────────────────────────────────────────────────
const DEMO_ASSIGNMENTS = [
  {
    need: 'Medical aid — Zone 7',
    urgency: 'CRITICAL',
    volunteer: 'Sneha Gupta',
    volInitials: 'SG',
    zone: 'Zone 7',
    stage: 'onsite',
    skills: ['Medical', 'First Aid'],
    matchPercent: 96,
    distance: '2.3 km',
    isDemo: true,
  },
  {
    need: 'Food distribution — Ward 2',
    urgency: 'HIGH',
    volunteer: 'Arjun Mehta',
    volInitials: 'AM',
    zone: 'Ward 2',
    stage: 'accepted',
    skills: ['Transport', 'Logistics'],
    matchPercent: 74,
    distance: '1.1 km',
    isDemo: true,
  },
  {
    need: 'Shelter repair — Zone 3',
    urgency: 'HIGH',
    volunteer: 'Fatima Khan',
    volInitials: 'FK',
    zone: 'Zone 3',
    stage: 'notified',
    skills: ['Counseling', 'Education'],
    matchPercent: 68,
    distance: '3.5 km',
    isDemo: true,
  },
];

// ─── Helper: get user's subcollection ref ─────────────────────────────
function userCol(uid, colName) {
  return collection(db, 'users', uid, colName);
}

// ─── Seed demo data if collection is empty ────────────────────────────
export async function seedDemoDataIfEmpty(uid) {
  // Check all collections in parallel (only fetch 1 document to check if empty)
  const [needsSnap, volSnap, assignSnap] = await Promise.all([
    getDocs(query(userCol(uid, 'needs'), limit(1))),
    getDocs(query(userCol(uid, 'volunteers'), limit(1))),
    getDocs(query(userCol(uid, 'assignments'), limit(1)))
  ]);

  const promises = [];

  // Seed needs
  if (needsSnap.empty) {
    for (const need of DEMO_NEEDS) {
      const daysAgo = Math.floor(Math.random() * 10) + 1;
      promises.push(addDoc(userCol(uid, 'needs'), {
        ...need,
        dateLogged: new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
        fieldReports: [],
        activityLog: [{ text: `Logged via ${need.source}`, time: `${daysAgo}d ago` }],
      }));
    }
  }

  // Seed volunteers
  if (volSnap.empty) {
    for (const vol of DEMO_VOLUNTEERS) {
      promises.push(addDoc(userCol(uid, 'volunteers'), {
        ...vol,
        createdAt: new Date().toISOString(),
        assignments: [],
        whatsappLog: [],
        avgResponseTime: '12 mins',
      }));
    }
  }

  // Seed assignments
  if (assignSnap.empty) {
    for (const assign of DEMO_ASSIGNMENTS) {
      const minsAgo = Math.floor(Math.random() * 120) + 10;
      promises.push(addDoc(userCol(uid, 'assignments'), {
        ...assign,
        minsAgo,
        timeLabel: minsAgo < 60 ? `${minsAgo}m ago` : `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m ago`,
        timedOut: assign.stage === 'notified' && minsAgo > 30,
        duration: assign.stage === 'completed' ? '2h 15m' : null,
        createdAt: new Date().toISOString(),
      }));
    }
  }

  // Wait for all writes to finish in parallel
  if (promises.length > 0) {
    await Promise.all(promises);
  }
}

// ─── Fetch needs ──────────────────────────────────────────────────────
export async function fetchNeeds(uid) {
  const snap = await getDocs(userCol(uid, 'needs'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Add a need ───────────────────────────────────────────────────────
export async function addNeed(uid, needData) {
  const urgency = Math.min(99, needData.severity * 12 + Math.floor(Math.random() * 20) + 10);
  const docRef = await addDoc(userCol(uid, 'needs'), {
    ...needData,
    urgency,
    reports: 1,
    volunteersAssigned: 0,
    volunteersNeeded: needData.volunteersNeeded || 2,
    status: 'Active',
    dateLogged: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    fieldReports: [],
    activityLog: [{ text: 'Logged manually by coordinator', time: 'Just now' }],
    frequency: 1,
    recency: 5,
    coverage: 1,
    isDemo: false,
  });
  return { id: docRef.id, ...needData, urgency, status: 'Active', isDemo: false };
}

// ─── Update a need's status ──────────────────────────────────────────
export async function updateNeedStatus(uid, needId, status) {
  const docRef = doc(db, 'users', uid, 'needs', needId);
  await updateDoc(docRef, { status });
}

// ─── Fetch volunteers ─────────────────────────────────────────────────
export async function fetchVolunteers(uid) {
  const snap = await getDocs(userCol(uid, 'volunteers'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Add a volunteer ──────────────────────────────────────────────────
export async function addVolunteer(uid, volData) {
  const docRef = await addDoc(userCol(uid, 'volunteers'), {
    ...volData,
    createdAt: new Date().toISOString(),
    isDemo: false,
  });
  return { id: docRef.id, ...volData, isDemo: false };
}

// ─── Fetch assignments ────────────────────────────────────────────────
export async function fetchAssignments(uid) {
  const snap = await getDocs(userCol(uid, 'assignments'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Add an assignment ────────────────────────────────────────────────
export async function addAssignment(uid, assignData) {
  const docRef = await addDoc(userCol(uid, 'assignments'), {
    ...assignData,
    createdAt: new Date().toISOString(),
    isDemo: false,
  });
  return { id: docRef.id, ...assignData, isDemo: false };
}

// ─── Compute dashboard metrics from live data ─────────────────────────
export function computeMetrics(needs, volunteers, assignments) {
  const activeNeeds = needs.filter(n => n.status !== 'Resolved').length;
  const criticalNeeds = needs.filter(n => n.urgency > 80).length;
  const availableVolunteers = volunteers.filter(v => v.status === 'Available').length;
  const totalVolunteers = volunteers.length;

  const completedAssignments = assignments.filter(a => a.stage === 'completed');
  const inProgressAssignments = assignments.filter(a => a.stage === 'onsite' || a.stage === 'accepted');

  return {
    activeNeeds,
    criticalNeeds,
    availableVolunteers,
    totalVolunteers,
    assignmentsToday: assignments.length,
    completedToday: completedAssignments.length,
    inProgressToday: inProgressAssignments.length,
    avgResponseTime: { hours: 1, minutes: 34 },
    avgResponseLastWeek: { hours: 1, minutes: 52 },
  };
}

// ─── Build dashboard map needs from live data ─────────────────────────
const ZONE_COORDS = {
  'Zone 1': { lat: 19.085, lng: 72.835 },
  'Zone 2': { lat: 19.100, lng: 72.845 },
  'Zone 3': { lat: 19.095, lng: 72.870 },
  'Zone 4': { lat: 19.070, lng: 72.880 },
  'Zone 5': { lat: 19.050, lng: 72.890 },
  'Zone 6': { lat: 19.040, lng: 72.860 },
  'Zone 7': { lat: 19.076, lng: 72.878 },
  'Zone 8': { lat: 19.110, lng: 72.910 },
  'Zone 9': { lat: 19.030, lng: 72.840 },
  'Ward 1': { lat: 19.060, lng: 72.850 },
  'Ward 2': { lat: 19.060, lng: 72.855 },
  'Ward 3': { lat: 19.055, lng: 72.865 },
  'Ward 4': { lat: 19.065, lng: 72.895 },
  'Ward 5': { lat: 19.065, lng: 72.905 },
};

export function buildMapNeeds(needs) {
  return needs
    .filter(n => n.status !== 'Resolved')
    .slice(0, 10)
    .map((n, i) => ({
      id: i + 1,
      title: n.title,
      zone: n.zone,
      lat: ZONE_COORDS[n.zone]?.lat || 19.076,
      lng: ZONE_COORDS[n.zone]?.lng || 72.878,
      urgency: n.urgency,
      reports: n.reports,
      volunteersAssigned: n.volunteersAssigned,
      category: n.category,
    }));
}

// ─── Build activity feed from live data ───────────────────────────────
export function buildActivityFeed(needs, volunteers) {
  const feed = [];
  needs.slice(0, 5).forEach((n, i) => {
    if (n.urgency > 80) {
      feed.push({ id: feed.length + 1, time: `${i * 5 + 2} mins ago`, type: 'critical', text: `Need logged: ${n.title}` });
    } else {
      feed.push({ id: feed.length + 1, time: `${i * 8 + 5} mins ago`, type: 'info', text: `Need updated: ${n.title}` });
    }
  });
  volunteers.slice(0, 3).forEach((v, i) => {
    feed.push({ id: feed.length + 1, time: `${i * 12 + 10} mins ago`, type: 'volunteer', text: `${v.name} is ${v.status.toLowerCase()}` });
  });
  needs.filter(n => n.status === 'Resolved').slice(0, 2).forEach((n, i) => {
    feed.push({ id: feed.length + 1, time: `${i * 15 + 20} mins ago`, type: 'resolved', text: `Resolved: ${n.title}` });
  });
  return feed.sort((a, b) => parseInt(a.time) - parseInt(b.time));
}

// ─── Build top urgent needs for dashboard ─────────────────────────────
export function buildTopUrgentNeeds(needs) {
  return needs
    .filter(n => n.status !== 'Resolved')
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, 5)
    .map(n => ({
      id: n.id,
      title: n.title,
      zone: n.zone,
      urgency: n.urgency,
      badge: n.urgency > 80 ? 'CRITICAL' : n.urgency > 50 ? 'HIGH' : 'MEDIUM',
    }));
}

// ─── Build volunteer status board ─────────────────────────────────────
export function buildVolunteerBoard(volunteers) {
  return {
    available: volunteers.filter(v => v.status === 'Available').map(v => ({
      id: v.id, name: v.name, initials: v.initials,
      skills: v.skills.map(s => s.name).slice(0, 2),
      status: 'Available', distance: v.distance,
    })),
    assigned: volunteers.filter(v => v.status === 'Assigned').map(v => ({
      id: v.id, name: v.name, initials: v.initials,
      skills: v.skills.map(s => s.name).slice(0, 2),
      status: `On Assignment — ${v.homeZone}`,
    })),
    rest: volunteers.filter(v => v.status === 'Rest Mode').map(v => ({
      id: v.id, name: v.name, initials: v.initials,
      skills: v.skills.map(s => s.name).slice(0, 2),
      status: 'Rest — back tomorrow',
    })),
  };
}

// ─── Impact metrics ───────────────────────────────────────────────────
export function computeImpactMetrics(needs, volunteers, assignments) {
  return {
    totalNeedsLogged: needs.length,
    needsResolved: needs.filter(n => n.status === 'Resolved').length,
    resolutionRate: needs.length > 0 ? Math.round((needs.filter(n => n.status === 'Resolved').length / needs.length) * 100) : 0,
    activeVolunteers: volunteers.filter(v => v.status !== 'Rest Mode').length,
    totalVolunteerHours: volunteers.reduce((sum, v) => sum + (v.hoursUsed || 0), 0),
    peopleHelped: needs.filter(n => n.status === 'Resolved').reduce((sum, n) => sum + (n.peopleAffected || 0), 0),
  };
}
