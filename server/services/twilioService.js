// ─── Twilio WhatsApp Service ─────────────────────────────
import twilio from 'twilio'
import config from '../config.js'
import { logMessage } from '../db.js'

// Lazy-initialize Twilio client (only when real credentials exist)
let client = null
const isDev = !config.twilio.accountSid.startsWith('AC')

function getClient() {
  if (!client && !isDev) {
    client = twilio(config.twilio.accountSid, config.twilio.authToken)
  }
  return client
}

if (isDev) {
  console.log('[TWILIO] ⚠ Running in SIMULATION mode — no real Twilio credentials configured')
  console.log('[TWILIO]   Messages will be logged to console instead of sent via WhatsApp')
}

/**
 * Send a WhatsApp message via Twilio
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} body - Message body
 * @returns {Promise<object>} Twilio message SID
 */
export async function sendWhatsApp(to, body) {
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

  // Development mode — simulate sending
  if (isDev) {
    console.log(`[TWILIO-SIM] 📤 To: ${to}`)
    console.log(`[TWILIO-SIM] 💬 ${body}`)
    console.log(`[TWILIO-SIM] ${'─'.repeat(40)}`)
    logMessage(config.twilio.whatsappNumber, to, body, 'outgoing-simulated')
    return { success: true, sid: `SIM_${Date.now()}`, simulated: true }
  }

  try {
    const message = await getClient().messages.create({
      from: config.twilio.whatsappNumber,
      to: toFormatted,
      body,
    })

    logMessage(config.twilio.whatsappNumber, to, body, 'outgoing')
    console.log(`[TWILIO] Sent to ${to}: "${body.substring(0, 60)}..."`)
    return { success: true, sid: message.sid }
  } catch (error) {
    console.error(`[TWILIO] Error sending to ${to}:`, error.message)
    logMessage(config.twilio.whatsappNumber, to, body, 'outgoing-simulated')
    return { success: false, error: error.message, simulated: true }
  }
}

/**
 * Send volunteer assignment notification
 */
export async function notifyVolunteer(volunteer, need) {
  const urgencyLabel = need.urgency >= 80 ? 'CRITICAL' : need.urgency >= 50 ? 'HIGH' : 'MEDIUM'
  const distance = `${(Math.random() * 5 + 0.5).toFixed(1)} km`

  const message =
`Hello ${volunteer.name}, this is NeedMap.
New task available matching your skills.
Need: ${need.title}
Location: ${need.zone}${need.location ? ' — ' + need.location : ''}
Distance: ${distance} from your location
Urgency: ${urgencyLabel}
Reply YES to accept or NO to decline.
This request expires in 30 minutes.`

  return sendWhatsApp(volunteer.phone, message)
}

/**
 * Send reminder to volunteer who hasn't replied
 */
export async function sendReminder(volunteer, need) {
  const message = `Reminder: Task in ${need.zone} still needs a volunteer. Reply YES to accept.`
  return sendWhatsApp(volunteer.phone, message)
}

/**
 * Send confirmation of field report receipt
 */
export async function sendReportConfirmation(phone, needsCount, urgencyLabel) {
  const message = `Received your report. ${needsCount} need(s) logged from this submission. Urgency level: ${urgencyLabel}. A volunteer will be notified shortly.`
  return sendWhatsApp(phone, message)
}

/**
 * Send acceptance confirmation to volunteer
 */
export async function sendAcceptanceConfirmation(volunteer, need) {
  const message = `Thank you ${volunteer.name}. Please head to ${need.zone}${need.location ? ' — ' + need.location : ''}. Contact coordinator at ${config.ngo.coordinatorPhone} if you need help.`
  return sendWhatsApp(volunteer.phone, message)
}

/**
 * Send decline acknowledgment
 */
export async function sendDeclineAck(volunteer) {
  const message = `Understood. We will find another volunteer. Thank you.`
  return sendWhatsApp(volunteer.phone, message)
}

/**
 * Send completion acknowledgment
 */
export async function sendCompletionAck(volunteer) {
  const message = `Great work ${volunteer.name}. Assignment marked complete. Rest before your next task.`
  return sendWhatsApp(volunteer.phone, message)
}

/**
 * Send partial update acknowledgment
 */
export async function sendPartialAck(volunteer) {
  const message = `Noted. Coordinator has been alerted. Stay on site if safe to do so.`
  return sendWhatsApp(volunteer.phone, message)
}

/**
 * Send help escalation acknowledgment
 */
export async function sendHelpAck(volunteer) {
  const message = `Help is on the way. Coordinator has been notified immediately. Stay safe.`
  return sendWhatsApp(volunteer.phone, message)
}

/**
 * Send unknown sender response
 */
export async function sendUnknownSenderResponse(phone) {
  const message = `Hello. This is NeedMap. To report a community need, please send a photo of your field report form. To register as a volunteer contact your NGO coordinator.`
  return sendWhatsApp(phone, message)
}
