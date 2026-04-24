// ─── AI Text Parser — Extracts structured data from OCR text ─────────────────

const categoryKeywords = {
  'Medical': ['medical','medicine','doctor','hospital','fever','injury','health','sick','patient','dehydration','wound','bleeding','ambulance','clinic','treatment'],
  'Food': ['food','hunger','hungry','meal','ration','rice','water','drinking','nutrition','starving','feed','kitchen'],
  'Flood Relief': ['flood','water level','submerged','drowning','rescue','boat','waterlogged','rain','storm','cyclone','dam'],
  'Sanitation': ['sanitation','toilet','sewage','waste','garbage','drain','hygiene','cleanup','contaminated','dirty'],
  'Education': ['education','school','children','books','study','teacher','learning','student','exam','classroom'],
  'Elder Care': ['elder','elderly','senior','old age','aged','pension','old people','grandfather','grandmother'],
  'Child Care': ['child','children','baby','infant','orphan','kid','toddler','minor','newborn','pregnant'],
  'Shelter': ['shelter','house','roof','tent','home','building','collapsed','structure','accommodation','displaced'],
}

const severityKeywords = {
  critical: ['critical','emergency','urgent','immediate','dying','life threatening','severe','dangerous','fatal','crisis'],
  high: ['high','serious','many people','families','multiple','several','widespread','growing','escalating'],
  medium: ['medium','moderate','some','few','limited','stable','manageable'],
  low: ['low','minor','small','single','one person','resolved','improving'],
}

const zonePatterns = [
  /zone\s*(\d+)/i,
  /ward\s*(\d+)/i,
  /area\s*(\d+)/i,
  /sector\s*(\d+)/i,
  /block\s*([a-z0-9]+)/i,
]

/**
 * Parse OCR text to extract structured need information
 * @param {string} text - Raw OCR text
 * @param {string[]} labels - Image labels from Vision API
 * @returns {object} Parsed need data
 */
export function parseFieldReport(text, labels = []) {
  const lowerText = text.toLowerCase()
  const result = {
    title: '',
    category: 'General',
    zone: 'Unknown',
    location: '',
    description: text.trim(),
    peopleAffected: 0,
    urgency: 50,
    severity: 3,
  }

  // ── 1. Extract Category ──
  let maxCatScore = 0
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    const score = keywords.filter(k => lowerText.includes(k)).length
    if (score > maxCatScore) { maxCatScore = score; result.category = cat }
  }

  // ── 2. Extract Zone/Location ──
  for (const pattern of zonePatterns) {
    const match = text.match(pattern)
    if (match) {
      result.zone = `Zone ${match[1]}`
      break
    }
  }

  // Try to extract specific location
  const locationPatterns = [
    /(?:location|place|area|near|at)\s*[:\-]?\s*(.+?)(?:\n|$)/i,
    /(?:dharavi|andheri|bandra|kurla|malad|goregaon|borivali|thane|navi mumbai|colaba)[^,\n]*/i,
  ]
  for (const lp of locationPatterns) {
    const lMatch = text.match(lp)
    if (lMatch) { result.location = lMatch[1] || lMatch[0]; break }
  }

  // ── 3. Extract People Affected ──
  const peoplePatterns = [
    /(\d+)\s*(?:people|families|persons|individuals|children|patients|affected)/i,
    /(?:people|families|affected)\s*[:\-]?\s*(\d+)/i,
  ]
  for (const pp of peoplePatterns) {
    const pMatch = text.match(pp)
    if (pMatch) { result.peopleAffected = parseInt(pMatch[1]); break }
  }

  // ── 4. Calculate Severity & Urgency ──
  let severityScore = 0
  for (const [level, keywords] of Object.entries(severityKeywords)) {
    const matches = keywords.filter(k => lowerText.includes(k)).length
    if (level === 'critical' && matches > 0) severityScore = Math.max(severityScore, 5)
    if (level === 'high' && matches > 0) severityScore = Math.max(severityScore, 4)
    if (level === 'medium' && matches > 0) severityScore = Math.max(severityScore, 3)
    if (level === 'low' && matches > 0) severityScore = Math.max(severityScore, 2)
  }
  if (severityScore === 0) severityScore = 3 // default medium
  result.severity = severityScore

  // Calculate urgency score (0-100)
  let urgency = severityScore * 15 // base: 30-75
  if (result.peopleAffected > 50) urgency += 15
  else if (result.peopleAffected > 10) urgency += 10
  else if (result.peopleAffected > 0) urgency += 5
  if (['Medical','Flood Relief'].includes(result.category)) urgency += 10
  if (labels.some(l => ['fire','smoke','flood','injury','blood'].includes(l.toLowerCase()))) urgency += 10
  result.urgency = Math.min(urgency, 100)

  // ── 5. Generate Title ──
  const urgLabel = result.urgency >= 80 ? 'Critical' : result.urgency >= 50 ? 'Urgent' : ''
  result.title = `${urgLabel ? urgLabel + ' — ' : ''}${result.category} need${result.zone !== 'Unknown' ? ' in ' + result.zone : ''}`

  console.log(`[PARSER] Parsed: category=${result.category}, zone=${result.zone}, people=${result.peopleAffected}, urgency=${result.urgency}`)
  return result
}
