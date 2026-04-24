// ─── Mock data for Needs Management ─────────────────────────────────

const categories = ['Medical', 'Food', 'Flood Relief', 'Sanitation', 'Education', 'Elder Care', 'Child Care', 'Shelter']
const zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5']
const statuses = ['Active', 'Assigned', 'In Progress', 'Resolved']
const sources = ['WhatsApp', 'Manual', 'Email', 'Field Visit', 'Phone Call']

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function generateNeeds(count) {
  const titles = [
    'Flood Relief supplies needed', 'Medical emergency — first-aid shortage', 'Food distribution disrupted',
    'Temporary shelter collapse risk', 'Water purification tablets required', 'Mental health counseling needed',
    'Clothing drive — winter supplies low', 'Road access blocked by debris', 'Sanitation maintenance overdue',
    'Education kit delivery pending', 'Elder care — mobility aids needed', 'Child care center damaged',
    'Vaccination drive staffing needed', 'Power outage — generator required', 'Drinking water contamination',
    'Burn injuries — specialized care', 'Pregnant women — transport needed', 'Orphanage food stock depleted',
    'Disabled access ramps destroyed', 'Community kitchen setup required', 'Mosquito net distribution',
    'Blanket distribution for cold wave', 'Debris clearing from main road', 'School building structural damage',
    'Sewage overflow in residential area', 'Medicines for chronic patients', 'Baby food and formula needed',
    'Temporary toilet installation', 'Solar lamp distribution needed', 'Bridge repair for access route',
  ]
  const needs = []
  for (let i = 0; i < count; i++) {
    const urgency = randomInt(10, 99)
    const status = randomFrom(statuses)
    const volNeeded = randomInt(1, 5)
    const volAssigned = status === 'Resolved' ? volNeeded : randomInt(0, volNeeded)
    const daysAgo = randomInt(0, 30)
    const date = new Date(Date.now() - daysAgo * 86400000)
    needs.push({
      id: `N-${String(i + 1).padStart(4, '0')}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` (${randomFrom(zones)})` : ''),
      category: randomFrom(categories),
      zone: randomFrom(zones),
      urgency,
      reports: randomInt(1, 18),
      volunteersAssigned: volAssigned,
      volunteersNeeded: volNeeded,
      status,
      dateLogged: date.toISOString().split('T')[0],
      source: randomFrom(sources),
      peopleAffected: randomInt(5, 500),
      description: `Community members reported urgent need for assistance. Multiple field reports confirm the situation requires immediate attention. Local resources are insufficient to handle the current demand.`,
      severity: randomInt(1, 5),
      frequency: randomInt(1, 5),
      recency: randomInt(1, 5),
      coverage: randomInt(1, 5),
      fieldReports: Array.from({ length: randomInt(1, 4) }, (_, j) => ({
        id: `FR-${i}-${j}`,
        timestamp: `${randomInt(1, 12)}h ago`,
        sender: `+91 ${randomInt(70000, 99999)} ${randomInt(10000, 99999)}`,
        message: 'Field report with details about the community need and ground situation.',
      })),
      activityLog: [
        { text: `Logged automatically via ${randomFrom(sources)}`, time: `${daysAgo}d ago` },
        ...(volAssigned > 0 ? [{ text: `Assigned to volunteer`, time: `${Math.max(0, daysAgo - 1)}d ago` }] : []),
        ...(status === 'In Progress' ? [{ text: 'Volunteer confirmed on site', time: `${randomInt(1, 12)}h ago` }] : []),
        ...(status === 'Resolved' ? [{ text: 'Marked as resolved', time: `${randomInt(1, 5)}h ago` }] : []),
      ],
    })
  }
  return needs.sort((a, b) => b.urgency - a.urgency)
}

export const allNeeds = generateNeeds(247)
export const categoriesList = categories
export const zonesList = zones
export const statusesList = statuses
export const sourcesList = sources

export const summaryStats = {
  total: 247,
  critical: allNeeds.filter(n => n.urgency > 80).length,
  inProgress: allNeeds.filter(n => n.status === 'In Progress').length,
  resolved: allNeeds.filter(n => n.status === 'Resolved').length,
}
