// ─── Timeout & Reminder Handler ─────────────────────────────
import config from '../config.js'
import { getTimedOutAssignments, getReminderExpiredAssignments, updateAssignment, updateVolunteer, getNeedById } from '../db.js'
import { sendReminder } from './twilioService.js'
import { reassignToNext } from './volunteerMatcher.js'

let intervalId = null

/**
 * Check for timed-out assignments and handle reminders/reassignment
 * Runs every 60 seconds
 */
async function checkTimeouts() {
  console.log(`[TIMEOUT] Running timeout check at ${new Date().toISOString()}`)

  // ── Phase 1: Send reminders (30 min with no reply) ──
  const needsReminder = getTimedOutAssignments(config.timeouts.firstReminder)
  for (const assignment of needsReminder) {
    const need = getNeedById(assignment.needId)
    if (!need) continue

    console.log(`[TIMEOUT] Sending reminder for ${assignment.id} — ${assignment.volunteerName}`)
    await sendReminder(
      { name: assignment.volunteerName, phone: assignment.volunteerPhone },
      need
    )
    updateAssignment(assignment.id, { reminderSent: true })
  }

  // ── Phase 2: Reassign (45 min total — reminder + 15 min) ──
  const expired = getReminderExpiredAssignments(config.timeouts.finalTimeout)
  for (const assignment of expired) {
    console.log(`[TIMEOUT] Assignment ${assignment.id} expired — reassigning from ${assignment.volunteerName}`)

    // Penalize volunteer response rate
    updateVolunteer(assignment.volunteerId, {
      status: 'Available',
      responseRate: Math.max(0, (assignment.responseRate || 80) - 5),
    })

    // Reassign to next best volunteer
    await reassignToNext(assignment)
  }
}

/**
 * Start the timeout checker interval
 */
export function startTimeoutChecker() {
  if (intervalId) return
  console.log(`[TIMEOUT] Starting timeout checker (every 60s)`)
  intervalId = setInterval(checkTimeouts, 60 * 1000)
  // Run once immediately
  checkTimeouts()
}

/**
 * Stop the timeout checker
 */
export function stopTimeoutChecker() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    console.log(`[TIMEOUT] Timeout checker stopped`)
  }
}
