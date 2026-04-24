// ─── NeedMap WhatsApp Bot Server ─────────────────────────────
import express from 'express'
import cors from 'cors'
import config from './config.js'
import webhookRoutes from './routes/webhook.js'
import { startTimeoutChecker } from './services/timeoutHandler.js'
import { getAllData } from './db.js'

const app = express()

// ── Middleware ──
app.use(cors())
app.use(express.urlencoded({ extended: true }))  // Twilio sends form-encoded data
app.use(express.json())

// ── Request logging ──
app.use((req, res, next) => {
  if (req.method !== 'GET' || !req.url.includes('health')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  }
  next()
})

// ── Routes ──
app.use('/webhook', webhookRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() })
})

// Dashboard data API (consumed by frontend)
app.get('/api/data', (req, res) => {
  const data = getAllData()
  res.json({
    needs: data.needs,
    volunteers: data.volunteers,
    assignments: data.assignments,
    messageLogs: data.messageLogs.slice(-50), // last 50 messages
  })
})

// Simulate incoming photo (for testing without Twilio)
app.post('/api/simulate/photo', async (req, res) => {
  const { extractTextFromImage } = await import('./services/visionService.js')
  const { parseFieldReport } = await import('./services/aiParser.js')
  const { matchAndNotifyVolunteer } = await import('./services/volunteerMatcher.js')
  const { createNeed } = await import('./db.js')

  const phone = req.body.phone || '+919999999999'

  // Use simulated OCR
  const { text, labels } = await extractTextFromImage('simulated://test')
  const parsed = parseFieldReport(text, labels)
  const need = createNeed({ ...parsed, source: 'WhatsApp-Simulated', reporterPhone: phone })

  let assignment = null
  if (need.urgency > 70) {
    assignment = await matchAndNotifyVolunteer(need.id)
  }

  res.json({ success: true, need, assignment, parsed })
})

// Simulate incoming text (for testing without Twilio)
app.post('/api/simulate/text', async (req, res) => {
  const webhookBody = {
    From: `whatsapp:${req.body.phone || '+919876543210'}`,
    Body: req.body.message || 'YES',
    NumMedia: '0',
  }

  // Import and call webhook handler directly
  const { default: fetch } = await import('axios').catch(() => ({ default: null }))
  try {
    const response = await fetch?.post(`http://localhost:${config.port}/webhook/whatsapp`, 
      new URLSearchParams(webhookBody).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    res.json({ success: true, message: `Simulated "${req.body.message}" from ${req.body.phone}` })
  } catch (e) {
    res.json({ success: true, message: `Simulated (internal): "${req.body.message}" from ${req.body.phone}`, note: 'Direct webhook call' })
  }
})

// ── Start Server ──
app.listen(config.port, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║         NeedMap WhatsApp Bot Server                  ║
║                                                      ║
║  Server:    http://localhost:${config.port}                  ║
║  Webhook:   http://localhost:${config.port}/webhook/whatsapp ║
║  Dashboard: http://localhost:${config.port}/api/data         ║
║  Health:    http://localhost:${config.port}/health            ║
║                                                      ║
║  Simulation endpoints:                               ║
║  POST /api/simulate/photo  — Simulate photo report   ║
║  POST /api/simulate/text   — Simulate volunteer msg  ║
║                                                      ║
║  Configure Twilio webhook URL:                       ║
║  https://your-domain/webhook/whatsapp                ║
╚══════════════════════════════════════════════════════╝
  `)

  // Start timeout checker
  startTimeoutChecker()
})
