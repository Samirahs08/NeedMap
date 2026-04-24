// ─── Mock data for Assignments Page ─────────────────────────────────

const names = ['Sneha Gupta','Arjun Mehta','Fatima Khan','Raj Patel','Meera Iyer','Ravi Kumar','Priya Sharma','Deepak Joshi','Anita Das','Vikram Singh','Amit Patel','Kavya Nair','Rohit Yadav','Pooja Bose','Sanjay Verma']
const needs = ['Medical aid — Zone 7','Food distribution — Ward 2','Shelter repair — Zone 3','Water supply — Zone 5','Road clearing — Zone 6','Sanitation — Ward 5','Education kits — Zone 2','Elder care — Zone 8','Child care — Zone 4','Flood relief — Zone 1']
const zones = ['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5','Zone 6','Zone 7','Zone 8','Zone 9','Ward 2','Ward 5']
const urgencies = ['CRITICAL','HIGH','MEDIUM']
const skills = ['Medical','First Aid','Transport','Food','Construction','Shelter','Water','Education','Counseling']

function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pick(a){return a[rand(0,a.length-1)]}
function initials(n){return n.split(' ').map(w=>w[0]).join('')}

function makeCard(id, stage) {
  const name = pick(names)
  const need = pick(needs)
  const urgency = pick(urgencies)
  const minsAgo = stage === 'notified' ? rand(2,90) : stage === 'accepted' ? rand(5,120) : stage === 'onsite' ? rand(10,300) : rand(30,600)
  return {
    id, need, urgency, volunteer: name, volInitials: initials(name),
    zone: pick(zones), stage,
    minsAgo,
    timeLabel: minsAgo < 60 ? `${minsAgo}m ago` : `${Math.floor(minsAgo/60)}h ${minsAgo%60}m ago`,
    timedOut: stage === 'notified' && minsAgo > 30,
    duration: stage === 'completed' ? `${rand(1,6)}h ${rand(0,59)}m` : null,
    skills: [pick(skills), pick(skills)],
    matchPercent: rand(60,99),
    distance: `${(Math.random()*6+0.3).toFixed(1)} km`,
  }
}

export const kanbanData = {
  notified: Array.from({length:6},(_,i)=>makeCard(i+1,'notified')),
  accepted: Array.from({length:5},(_,i)=>makeCard(i+20,'accepted')),
  onsite: Array.from({length:4},(_,i)=>makeCard(i+40,'onsite')),
  completed: Array.from({length:8},(_,i)=>makeCard(i+60,'completed')),
}

export const escalatedAssignments = [
  {id:101,need:'Medical aid — Zone 7',volunteer:'Ravi Kumar',volInitials:'RK',zone:'Zone 7',urgency:'CRITICAL',reason:'Volunteer requested help',timeSince:'45 mins',suggestion:'Send backup volunteer with medical supplies',timeline:[{text:'Assignment created',time:'3h ago'},{text:'Volunteer accepted',time:'2h 30m ago'},{text:'Volunteer on site',time:'2h ago'},{text:'Volunteer sent HELP message',time:'45m ago'}]},
  {id:102,need:'Shelter repair — Zone 3',volunteer:'Deepak Joshi',volInitials:'DJ',zone:'Zone 3',urgency:'HIGH',reason:'Stuck in Accepted stage for over 2 hours',timeSince:'2h 15m',suggestion:'Call volunteer or reassign to nearby available volunteer',timeline:[{text:'Assignment created',time:'4h ago'},{text:'Volunteer accepted',time:'2h 15m ago'},{text:'No on-site confirmation received',time:'Now'}]},
  {id:103,need:'Food distribution — Ward 2',volunteer:'Anita Das',volInitials:'AD',zone:'Ward 2',urgency:'HIGH',reason:'Coordinator flagged — insufficient supplies',timeSince:'1h 20m',suggestion:'Coordinate additional supply delivery before volunteer arrives',timeline:[{text:'Assignment created',time:'3h ago'},{text:'Volunteer accepted',time:'2h 40m ago'},{text:'Coordinator flagged issue',time:'1h 20m ago'}]},
]

export const unassignedNeeds = [
  {id:1,title:'Vaccination drive — Zone 9',urgency:88,zone:'Zone 9'},
  {id:2,title:'Blanket distribution — Zone 4',urgency:72,zone:'Zone 4'},
  {id:3,title:'Debris clearing — Ward 3',urgency:65,zone:'Ward 3'},
  {id:4,title:'Mental health counseling — Zone 1',urgency:58,zone:'Zone 1'},
  {id:5,title:'Baby formula needed — Zone 6',urgency:81,zone:'Zone 6'},
]

export const matchedVolunteers = [
  {id:1,name:'Sneha Gupta',initials:'SG',matchPercent:96,distance:'2.3 km',skills:['Medical','First Aid'],availability:'Available now'},
  {id:2,name:'Raj Patel',initials:'RP',matchPercent:89,distance:'0.8 km',skills:['Food','Distribution'],availability:'Available now'},
  {id:3,name:'Arjun Mehta',initials:'AM',matchPercent:74,distance:'1.1 km',skills:['Transport','Logistics'],availability:'Available now'},
  {id:4,name:'Fatima Khan',initials:'FK',matchPercent:68,distance:'3.5 km',skills:['Counseling','Health'],availability:'Available now'},
  {id:5,name:'Meera Iyer',initials:'MI',matchPercent:55,distance:'4.2 km',skills:['Education','Children'],availability:'Available in 30 mins'},
]
