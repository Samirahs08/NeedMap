// ─── Twilio Webhook Routes ─────────────────────────────
import { Router } from 'express'
import { extractTextFromImage } from '../services/visionService.js'
import { parseFieldReport } from '../services/aiParser.js'
import { matchAndNotifyVolunteer, reassignToNext } from '../services/volunteerMatcher.js'
import {
  sendReportConfirmation, sendAcceptanceConfirmation, sendDeclineAck,
  sendCompletionAck, sendPartialAck, sendHelpAck, sendUnknownSenderResponse,
} from '../services/twilioService.js'
import {
  createNeed, findVolunteerByPhone, findPendingAssignment,
  updateAssignment, updateVolunteer, updateNeed, getNeedById, logMessage,
} from '../db.js'
import config from '../config.js'

const router = Router()

/**
 * POST /webhook/whatsapp — Twilio incoming message webhook
 * Handles both photo submissions and text commands
 */
router.post('/whatsapp', async (req, res) => {
  try {
    const from = req.body.From || ''           // whatsapp:+91XXXXXXXXXX
    const body = (req.body.Body || '').trim()
    const numMedia = parseInt(req.body.NumMedia || '0')
    const mediaUrl = req.body.MediaUrl0 || null
    const phone = from.replace('whatsapp:', '')

    console.log(`\n${'═'.repeat(60)}`)
    console.log(`[WEBHOOK] Incoming from: ${phone}`)
    console.log(`[WEBHOOK] Body: "${body}" | Media: ${numMedia}`)
    console.log(`${'═'.repeat(60)}`)

    logMessage(phone, config.twilio.whatsappNumber, body, 'incoming')

    // ─── PHOTO RECEIVED — Process field report ───
    if (numMedia > 0 && mediaUrl) {
      console.log(`[WEBHOOK] Processing photo submission from ${phone}`)

      // 1. OCR extraction
      const { text, labels } = await extractTextFromImage(mediaUrl)

      // 2. AI parsing
      const parsed = parseFieldReport(text, labels)

      // 3. Create need record
      const need = createNeed({
        ...parsed,
        source: 'WhatsApp',
        reporterPhone: phone,
      })

      // 4. Determine urgency label
      const urgLabel = need.urgency >= 80 ? 'CRITICAL' : need.urgency >= 50 ? 'HIGH' : 'MEDIUM'

      // 5. Reply with confirmation
      await sendReportConfirmation(phone, 1, urgLabel)

      // 6. Auto-trigger volunteer matching if urgency > 70
      if (need.urgency > 70) {
        console.log(`[WEBHOOK] Urgency ${need.urgency} > 70 — auto-matching volunteer`)
        await matchAndNotifyVolunteer(need.id)
      }

      return res.status(200).type('text/xml').send('<Response></Response>')
    }

    // ─── TEXT MESSAGE — Check volunteer commands ───
    const volunteer = findVolunteerByPhone(phone)
    const upperBody = body.toUpperCase()

    if (!volunteer) {
      // Unknown sender
      console.log(`[WEBHOOK] Unknown sender: ${phone}`)
      await sendUnknownSenderResponse(phone)
      return res.status(200).type('text/xml').send('<Response></Response>')
    }

    // Find their active assignment
    const assignment = findPendingAssignment(phone)

    // ── YES — Accept assignment ──
    if (upperBody === 'YES') {
      if (!assignment || assignment.status !== 'Notified') {
        console.log(`[WEBHOOK] ${volunteer.name} said YES but no pending assignment`)
        return res.status(200).type('text/xml').send('<Response></Response>')
      }

      updateAssignment(assignment.id, {
        status: 'Accepted',
        acceptedAt: new Date().toISOString(),
      })

      const need = getNeedById(assignment.needId)
      await sendAcceptanceConfirmation(volunteer, need)

      console.log(`[WEBHOOK] ✓ ${volunteer.name} ACCEPTED assignment ${assignment.id}`)
      return res.status(200).type('text/xml').send('<Response></Response>')
    }

    // ── NO — Decline assignment ──
    if (upperBody === 'NO') {
      if (!assignment) {
        return res.status(200).type('text/xml').send('<Response></Response>')
      }

      // Record decline
      const declined = [...(assignment.declinedVolunteers || []), volunteer.id]
      updateAssignment(assignment.id, { declinedVolunteers: declined })
      updateVolunteer(volunteer.id, { status: 'Available' })

      await sendDeclineAck(volunteer)

      // Auto-reassign to next best volunteer
      console.log(`[WEBHOOK] ✗ ${volunteer.name} DECLINED — finding next volunteer`)
      await reassignToNext(assignment)

      return res.status(200).type('text/xml').send('<Response></Response>')
    }

    // ── DONE — Complete assignment ──
    if (upperBody === 'DONE') {
      if (!assignment || !['Accepted', 'OnSite'].includes(assignment.status)) {
        return res.status(200).type('text/xml').send('<Response></Response>')
      }

      const completedAt = new Date()
      const startedAt = new Date(assignment.acceptedAt || assignment.notifiedAt)
      const totalMinutes = Math.round((completedAt - startedAt) / 60000)

      updateAssignment(assignment.id, {
        status: 'Completed',
        completedAt: completedAt.toISOString(),
        totalTime: totalMinutes,
      })

      updateVolunteer(volunteer.id, {
        status: 'Available',
        hoursUsed: volunteer.hoursUsed + Math.round(totalMinutes / 60),
      })

      // Mark need as resolved if all volunteers done
      const need = getNeedById(assignment.needId)
      if (need) updateNeed(need.id, { status: 'Resolved' })

      await sendCompletionAck(volunteer)

      console.log(`[WEBHOOK] ✓ ${volunteer.name} COMPLETED assignment ${assignment.id} in ${totalMinutes}m`)
      return res.status(200).type('text/xml').send('<Response></Response>')
    }

    // ── PARTIAL — Partial completion ──
    if (upperBody === 'PARTIAL') {
      if (!assignment) {
        return res.status(200).type('text/xml').send('<Response></Response>')
      }

      // Notify coordinator (in production: send email/push notification)
      console.log(`[WEBHOOK] ⚠ ${volunteer.name} reported PARTIAL completion — notifying coordinator`)

      await sendPartialAck(volunteer)
      return res.status(200).type('text/xml').send('<Response></Response>')
    }

    // ── HELP — Escalation ──
    if (upperBody === 'HELP') {
      if (!assignment) {
        return res.status(200).type('text/xml').send('<Response></Response>')
      }

      updateAssignment(assignment.id, {
        escalated: true,
        escalatedAt: new Date().toISOString(),
        escalationReason: 'Volunteer requested help',
      })

      // Urgent coordinator notification
      console.log(`[WEBHOOK] 🚨 ESCALATION — ${volunteer.name} requested HELP for ${assignment.needTitle}`)
      console.log(`[WEBHOOK] 🚨 Sending urgent email to ${config.ngo.coordinatorEmail}`)

      await sendHelpAck(volunteer)
      return res.status(200).type('text/xml').send('<Response></Response>')
    }

    // ── ON SITE — Volunteer arrived ──
    if (upperBody === 'ON SITE' || upperBody === 'ONSITE' || upperBody === 'ARRIVED') {
      if (assignment && assignment.status === 'Accepted') {
        updateAssignment(assignment.id, {
          status: 'OnSite',
          onSiteAt: new Date().toISOString(),
        })
        console.log(`[WEBHOOK] 📍 ${volunteer.name} is ON SITE for ${assignment.needTitle}`)
      }
      return res.status(200).type('text/xml').send('<Response></Response>')
    }

    // ── Unrecognized command from volunteer ──
    console.log(`[WEBHOOK] Unrecognized command from ${volunteer.name}: "${body}"`)
    return res.status(200).type('text/xml').send('<Response></Response>')

  } catch (error) {
    console.error('[WEBHOOK] Error:', error)
    return res.status(200).type('text/xml').send('<Response></Response>')
  }
})

/**
 * GET /webhook/status — Health check and current data
 */
router.get('/status', (req, res) => {
  const { getAllData } = require('../db.js')
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
