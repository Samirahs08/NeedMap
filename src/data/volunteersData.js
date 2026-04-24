// ─── Mock data for Volunteer Management ─────────────────────────────

const firstNames = ['Sneha','Arjun','Fatima','Raj','Meera','Ravi','Priya','Deepak','Anita','Vikram','Amit','Kavya','Rohit','Pooja','Sanjay','Neha','Anil','Divya','Karan','Lakshmi','Suresh','Asha','Mohan','Nisha','Rahul','Geeta','Vijay','Sunita','Ajay','Rekha']
const lastNames = ['Gupta','Mehta','Khan','Patel','Iyer','Kumar','Sharma','Joshi','Das','Singh','Nair','Yadav','Reddy','Bose','Verma','Chauhan','Pillai','Mishra','Thakur','Desai']
const allSkills = ['Medical','First Aid','Counseling','Transport','Logistics','Food Distribution','Construction','Shelter','Water & Sanitation','Education','Child Care','Elder Care','Translation','Communication','Security']
const languages = ['Hindi','English','Marathi','Tamil','Gujarati','Bengali','Urdu','Kannada']
const zones = ['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5','Zone 6','Zone 7','Zone 8','Zone 9']
const statuses = ['Available','Assigned','Rest Mode']
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const profLevels = ['Basic','Trained','Expert']

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick(arr) { return arr[rand(0, arr.length - 1)] }
function pickN(arr, n) { const s = new Set(); while (s.size < Math.min(n, arr.length)) s.add(pick(arr)); return [...s] }

function generateVolunteers(count) {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(firstNames), last = pick(lastNames)
    const name = `${first} ${last}`
    const initials = `${first[0]}${last[0]}`
    const skills = pickN(allSkills, rand(2, 6)).map(s => ({ name: s, level: pick(profLevels) }))
    const status = pick(statuses)
    const weeklyLimit = rand(15, 30)
    const hoursUsed = status === 'Rest Mode' ? weeklyLimit : rand(0, weeklyLimit - 1)
    const totalAssignments = rand(5, 120)
    const completionRate = rand(70, 100)
    const joinedDaysAgo = rand(30, 600)
    const joined = new Date(Date.now() - joinedDaysAgo * 86400000).toISOString().split('T')[0]
    const phone = `+91 ${rand(70000,99999)} ${rand(10000,99999)}`
    const maskedPhone = `+91 ${String(rand(70,99))}XXX XX${String(rand(100,999))}`
    const availDays = pickN(days, rand(3, 7))
    const responseRate = rand(65, 100)
    const onTimeRate = rand(60, 100)
    const feedbackScore = rand(60, 100)
    const perfScore = Math.round((responseRate + completionRate + onTimeRate + feedbackScore) / 4)
    const coverageRadius = `${rand(1, 10)} km`

    return {
      id: i + 1,
      name, initials, phone, maskedPhone,
      skills,
      homeZone: pick(zones),
      languages: pickN(languages, rand(1, 3)),
      status,
      weeklyLimit, hoursUsed,
      totalAssignments,
      completedAssignments: Math.round(totalAssignments * completionRate / 100),
      completionRate,
      joined,
      availabilityDays: availDays,
      availabilityHours: `${rand(7,10)}:00 — ${rand(17,21)}:00`,
      emergencyContact: `${pick(firstNames)} ${pick(lastNames)}`,
      coverageRadius,
      distance: `${(Math.random() * 8 + 0.3).toFixed(1)} km`,
      performance: { score: perfScore, responseRate, completionRate, onTimeRate, feedbackScore },
      matchScore: rand(40, 99),
      assignments: Array.from({ length: rand(3, 10) }, (_, j) => ({
        id: j + 1,
        date: new Date(Date.now() - rand(1, 180) * 86400000).toISOString().split('T')[0],
        title: pick(['Medical aid delivery','Food distribution','Shelter setup','Water supply','Road clearing','Education kit delivery','Elder care visit','Child care support','Sanitation maintenance','Flood relief']),
        zone: pick(zones),
        duration: `${rand(1, 8)}h ${rand(0, 59)}m`,
        status: pick(['Completed','Completed','Completed','In Progress','Cancelled']),
        rating: rand(3, 5),
      })),
      whatsappLog: Array.from({ length: rand(3, 8) }, (_, j) => ({
        id: j + 1,
        timestamp: `${rand(1, 30)}d ago`,
        messageSent: pick([
          'New assignment: Medical aid needed in Zone 4. Please confirm.',
          'Reminder: Your shift starts in 1 hour at Zone 7.',
          'Assignment update: Food distribution at Ward 2 has been resolved.',
          'Weekly summary: You completed 3 tasks this week. Thank you!',
          'New urgent need near your area. Can you respond?',
        ]),
        reply: pick(['Confirmed, on my way','OK noted','Will be there in 30 mins','Cannot attend today','Thanks for the update',null]),
        replyTime: pick(['2 mins','5 mins','12 mins','1 hour','3 hours',null]),
      })),
      avgResponseTime: `${rand(2, 45)} mins`,
    }
  })
}

export const allVolunteers = generateVolunteers(68)
export const skillsList = allSkills
export const languagesList = languages
export const zonesList = zones
export const daysList = days

export const volunteerSummary = {
  total: 68,
  available: allVolunteers.filter(v => v.status === 'Available').length,
  restMode: allVolunteers.filter(v => v.status === 'Rest Mode').length,
}
