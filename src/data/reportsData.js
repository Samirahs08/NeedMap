// ─── Mock data for Reports Page ─────────────────────────────────

function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}

const categories = ['Medical','Food','Flood Relief','Sanitation','Education','Elder Care','Child Care','Shelter']
const zones = ['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5','Zone 6','Zone 7','Zone 8','Zone 9']

export function getReportData(range) {
  const days = range === 'week' ? 7 : range === 'month' ? 30 : range === '3months' ? 90 : 30
  const totalNeeds = rand(120, 400) * (days / 30)
  const resolved = Math.round(totalNeeds * (rand(65, 85) / 100))
  const resolutionRate = Math.round((resolved / totalNeeds) * 100)
  const totalHours = rand(300, 1200) * (days / 30)
  const avgResponse = rand(12, 38)

  return {
    summary: {
      totalNeeds: Math.round(totalNeeds),
      resolved,
      resolutionRate,
      totalHours: Math.round(totalHours),
      avgResponse,
      zonesCovered: rand(7, 9),
    },

    categoryBreakdown: categories.map(c => ({
      name: c,
      value: rand(8, 60),
      color: { Medical:'#ef4444', Food:'#f59e0b', 'Flood Relief':'#3b82f6', Sanitation:'#8b5cf6', Education:'#06b6d4', 'Elder Care':'#ec4899', 'Child Care':'#f97316', Shelter:'#22c55e' }[c]
    })),

    dailyVolume: Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - (days - i) * 86400000)
      return { date: `${d.getMonth()+1}/${d.getDate()}`, needs: rand(2, 18), resolved: rand(1, 14) }
    }),

    urgencyDist: [
      { band: 'Critical', count: rand(15, 45), color: '#ef4444' },
      { band: 'High', count: rand(25, 60), color: '#f97316' },
      { band: 'Medium', count: rand(30, 50), color: '#3b82f6' },
      { band: 'Low', count: rand(10, 30), color: '#22c55e' },
    ],

    topVolunteers: [
      { name: 'Sneha Gupta', assignments: rand(12, 28) },
      { name: 'Arjun Mehta', assignments: rand(10, 25) },
      { name: 'Fatima Khan', assignments: rand(8, 22) },
      { name: 'Raj Patel', assignments: rand(7, 20) },
      { name: 'Ravi Kumar', assignments: rand(6, 18) },
      { name: 'Priya Sharma', assignments: rand(5, 16) },
      { name: 'Deepak Joshi', assignments: rand(4, 14) },
      { name: 'Meera Iyer', assignments: rand(3, 13) },
      { name: 'Vikram Singh', assignments: rand(3, 11) },
      { name: 'Anita Das', assignments: rand(2, 10) },
    ].sort((a,b) => b.assignments - a.assignments),

    zoneHeatmap: zones.map(z => ({
      zone: z,
      needsLogged: rand(10, 55),
      resolved: rand(5, 40),
      active: rand(2, 15),
      volunteersDeployed: rand(3, 12),
      coverageScore: rand(40, 98),
    })),

    responseBreakdown: {
      loggedToNotified: rand(3, 12),
      notifiedToAccepted: rand(5, 18),
      acceptedToCompleted: rand(30, 120),
      byCategory: categories.slice(0, 5).map(c => ({
        category: c,
        avgTime: rand(15, 90),
      })),
    },

    donorText: (s) => `In the selected period, NeedMap helped Hope Foundation respond to ${s.totalNeeds} community needs across ${s.zonesCovered} zones. ${s.resolved} needs were resolved with a ${s.resolutionRate}% resolution rate. Our network of volunteers contributed ${s.totalHours} total hours. Average response time was ${s.avgResponse} minutes. ${Math.round(s.resolved * 0.4)}% of critical needs were resolved within 2 hours.`,
  }
}
