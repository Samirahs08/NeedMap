// ─── Smart Upload Parser — Client-side AI categorization ─────────────────

/**
 * Parse CSV/text content and categorize entries as Service Providers or Service Receivers
 */
export function parseUploadedText(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 3)
  const results = { providers: [], receivers: [], unknown: [] }

  const providerKeywords = ['volunteer','provider','doctor','nurse','teacher','counselor','driver','helper','social worker','ngo','caretaker','paramedic','technician','coordinator','field worker','trainer','mentor','therapist','engineer','plumber','electrician','mechanic','cook','chef','pharmacist','dietitian']
  const receiverKeywords = ['patient','beneficiary','victim','displaced','homeless','orphan','widow','elderly','disabled','pregnant','child','infant','family','refugee','survivor','needy','affected','injured','malnourished','unemployed','destitute','migrant']
  const skillKeywords = ['medical','first aid','transport','food','construction','shelter','education','counseling','sanitation','logistics','security','translation','child care','elder care','water','nutrition']
  const needKeywords = ['needs','requires','seeking','request','shortage','lacking','without','urgent','critical','emergency','help','support','assistance','relief','supply','treatment','medicine','food','water','shelter','clothing','blankets']

  let headerRow = null
  let idCounter = 1

  for (const line of lines) {
    // Try CSV parsing
    const cells = line.split(/[,\t;|]/).map(c => c.trim().replace(/^["']|["']$/g, ''))
    const fullText = cells.join(' ').toLowerCase()

    // Detect header row
    if (!headerRow && (fullText.includes('name') || fullText.includes('type') || fullText.includes('category') || fullText.includes('role'))) {
      headerRow = cells.map(c => c.toLowerCase())
      continue
    }

    // Score for provider vs receiver
    let providerScore = 0
    let receiverScore = 0

    providerKeywords.forEach(kw => { if (fullText.includes(kw)) providerScore += 2 })
    receiverKeywords.forEach(kw => { if (fullText.includes(kw)) receiverScore += 2 })
    skillKeywords.forEach(kw => { if (fullText.includes(kw)) providerScore += 1 })
    needKeywords.forEach(kw => { if (fullText.includes(kw)) receiverScore += 1 })

    // Check explicit category column if header detected
    if (headerRow) {
      const catIdx = headerRow.findIndex(h => ['type','category','role','designation','status'].includes(h))
      if (catIdx >= 0 && cells[catIdx]) {
        const catVal = cells[catIdx].toLowerCase()
        if (providerKeywords.some(k => catVal.includes(k)) || catVal.includes('provider')) providerScore += 5
        if (receiverKeywords.some(k => catVal.includes(k)) || catVal.includes('receiver') || catVal.includes('beneficiary')) receiverScore += 5
      }
    }

    // Extract structured data
    const entry = {
      id: idCounter++,
      raw: line,
      name: extractField(cells, headerRow, ['name','full name','person','volunteer','patient','beneficiary']) || cells[0] || 'Unknown',
      phone: extractField(cells, headerRow, ['phone','mobile','contact','number','tel']) || extractPhone(fullText),
      category: extractField(cells, headerRow, ['category','type','role','service','designation','skill']) || '',
      zone: extractField(cells, headerRow, ['zone','area','location','ward','address','place']) || extractZone(fullText),
      notes: extractField(cells, headerRow, ['notes','description','details','remarks','needs','issues']) || '',
      confidence: 0,
    }

    if (providerScore > receiverScore && providerScore >= 2) {
      entry.confidence = Math.min(Math.round((providerScore / (providerScore + receiverScore)) * 100), 99)
      entry.detectedCategory = inferCategory(fullText, 'provider')
      results.providers.push(entry)
    } else if (receiverScore > providerScore && receiverScore >= 2) {
      entry.confidence = Math.min(Math.round((receiverScore / (providerScore + receiverScore)) * 100), 99)
      entry.detectedCategory = inferCategory(fullText, 'receiver')
      results.receivers.push(entry)
    } else if (cells.length >= 2 && entry.name !== 'Unknown') {
      entry.confidence = 40
      entry.detectedCategory = 'Uncategorized'
      results.unknown.push(entry)
    }
  }

  return results
}

function extractField(cells, header, fieldNames) {
  if (!header) return null
  for (const fn of fieldNames) {
    const idx = header.findIndex(h => h.includes(fn))
    if (idx >= 0 && cells[idx] && cells[idx].length > 1) return cells[idx]
  }
  return null
}

function extractPhone(text) {
  const match = text.match(/(\+?\d[\d\s\-]{8,14}\d)/)
  return match ? match[1].replace(/\s/g, '') : ''
}

function extractZone(text) {
  const match = text.match(/zone\s*\d+|ward\s*\d+|area\s*\d+/i)
  return match ? match[0] : ''
}

function inferCategory(text, type) {
  if (type === 'provider') {
    if (/medical|doctor|nurse|paramedic|health|pharmac/i.test(text)) return 'Medical'
    if (/teacher|education|school|tutor|mentor/i.test(text)) return 'Education'
    if (/food|cook|chef|nutrition|kitchen|meal/i.test(text)) return 'Food Distribution'
    if (/counsel|therapy|mental|psycho|social worker/i.test(text)) return 'Counseling'
    if (/transport|driver|vehicle|logistics/i.test(text)) return 'Transport'
    if (/construct|build|shelter|plumb|electric|mechanic/i.test(text)) return 'Construction'
    if (/security|guard|patrol/i.test(text)) return 'Security'
    return 'General Volunteer'
  } else {
    if (/medical|patient|sick|fever|injur|treat|medicine|hospital/i.test(text)) return 'Medical Need'
    if (/food|hungry|meal|ration|starv|malnutri/i.test(text)) return 'Food Need'
    if (/shelter|house|homeless|displaced|tent|roof/i.test(text)) return 'Shelter Need'
    if (/education|school|child|orphan/i.test(text)) return 'Education Need'
    if (/elder|old|aged|senior/i.test(text)) return 'Elder Care'
    if (/flood|water|rescue|drown/i.test(text)) return 'Flood Relief'
    return 'General Need'
  }
}

/**
 * Generate demo data for testing the upload feature
 */
export function getDemoCSV() {
  return `Name,Phone,Role,Category,Zone,Notes
Dr. Priya Sharma,+919876500001,Volunteer,Medical Doctor,Zone 1,Available weekdays 9-5
Rahul Verma,+919876500002,Volunteer,Transport Driver,Zone 3,Has own vehicle
Sunita Devi,+919876500003,Beneficiary,Patient,Zone 7,Needs daily medication
Anil Kumar,+919876500004,Volunteer,Food Distribution,Zone 2,Experienced cook
Fatima Begum,+919876500005,Beneficiary,Displaced Family,Zone 5,Family of 6 needs shelter
Meera Nair,+919876500006,Volunteer,Teacher,Zone 4,Can teach children aged 5-12
Raju Patil,+919876500007,Beneficiary,Elderly Patient,Zone 8,Needs elder care assistance
Deepa Joshi,+919876500008,Volunteer,Counselor,Zone 6,Mental health professional
Mohd Irfan,+919876500009,Beneficiary,Flood Victim,Zone 1,Lost house in floods
Kavita Rao,+919876500010,Volunteer,Nurse,Zone 7,ICU trained
Sanjay Gupta,+919876500011,Beneficiary,Orphan Child,Zone 3,10 year old needs education
Nisha Thakur,+919876500012,Volunteer,Social Worker,Zone 9,Fluent in 4 languages
Gopal Singh,+919876500013,Beneficiary,Malnourished Family,Zone 2,5 children need nutrition
Amita Patel,+919876500014,Volunteer,Pharmacist,Zone 4,Can manage medicine distribution
Bablu Yadav,+919876500015,Beneficiary,Injured Worker,Zone 6,Construction accident victim`
}
