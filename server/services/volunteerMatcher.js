// ─── Volunteer Matching Engine ─────────────────────────────
import { getAvailableVolunteers, createAssignment, getNeedById, updateAssignment } from '../db.js'
import { notifyVolunteer } from './twilioService.js'

/**
 * Calculate match score between a volunteer and a need
 */
function calculateMatchScore(volunteer, need) {
  let score = 0

  // Skill match (up to 40 points)
  const needSkills = getCategorySkills(need.category)
  const matchedSkills = volunteer.skills.filter(s => needSkills.includes(s))
  score += (matchedSkills.length / Math.max(needSkills.length, 1)) * 40

  // Zone proximity (up to 25 points)
  if (volunteer.homeZone === need.zone) score += 25
  else {
    const volZoneNum = parseInt(volunteer.homeZone.replace(/\D/g, '')) || 0
    const needZoneNum = parseInt(need.zone.replace(/\D/g, '')) || 0
    const zoneDiff = Math.abs(volZoneNum - needZoneNum)
    score += Math.max(0, 25 - zoneDiff * 5)
  }

  // Availability (up to 20 points)
  const hoursRemaining = volunteer.weeklyLimit - volunteer.hoursUsed
  score += Math.min(hoursRemaining / volunteer.weeklyLimit, 1) * 20

  // Response rate bonus (up to 15 points)
  score += (volunteer.responseRate / 100) * 15

  return Math.round(score)
}

/**
 * Map need category to required volunteer skills
 */
function getCategorySkills(category) {
  const map = {
    'Medical': ['Medical', 'First Aid', 'Health'],
    'Food': ['Food Distribution', 'Logistics', 'Transport'],
    'Flood Relief': ['Transport', 'Construction', 'First Aid'],
    'Sanitation': ['Sanitation', 'Construction'],
    'Education': ['Education', 'Child Care', 'Counseling'],
    'Elder Care': ['Elder Care', 'Medical', 'Counseling'],
    'Child Care': ['Child Care', 'Education', 'First Aid'],
    'Shelter': ['Construction', 'Shelter', 'Transport'],
  }
  return map[category] || []
}

/**
 * Find and notify the best matched volunteer for a need
 * @param {string} needId - Need ID to match
 * @param {number[]} excludeIds - Volunteer IDs to exclude (already declined)
 * @returns {object|null} Assignment created or null
 */
export async function matchAndNotifyVolunteer(needId, excludeIds = []) {
  const need = getNeedById(needId)
  if (!need) { console.error(`[MATCHER] Need ${needId} not found`); return null }

  const available = getAvailableVolunteers().filter(v => !excludeIds.includes(v.id))
  if (available.length === 0) {
    console.warn(`[MATCHER] No available volunteers for ${needId}`)
    return null
  }

  // Rank by match score
  const ranked = available
    .map(v => ({ ...v, matchScore: calculateMatchScore(v, need) }))
    .sort((a, b) => b.matchScore - a.matchScore)

  const bestMatch = ranked[0]
  console.log(`[MATCHER] Best match for ${needId}: ${bestMatch.name} (score: ${bestMatch.matchScore})`)

  // Create assignment and notify
  const assignment = createAssignment(needId, bestMatch.id)
  if (assignment) {
    await notifyVolunteer(bestMatch, need)
    console.log(`[MATCHER] Volunteer ${bestMatch.name} notified for ${need.title}`)
  }

  return assignment
}

/**
 * Reassign a need to the next best volunteer after decline/timeout
 */
export async function reassignToNext(assignment) {
  const declinedIds = [...(assignment.declinedVolunteers || []), assignment.volunteerId]

  // Cancel current assignment
  updateAssignment(assignment.id, { status: 'Cancelled' })

  // Find next best match
  return matchAndNotifyVolunteer(assignment.needId, declinedIds)
}
