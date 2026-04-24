// ─── NeedMap WhatsApp Bot Configuration ─────────────────────────────
import dotenv from 'dotenv'
dotenv.config()

export default {
  port: process.env.PORT || 3001,

  // Twilio credentials
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'YOUR_ACCOUNT_SID',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'YOUR_AUTH_TOKEN',
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
  },

  // Google Cloud Vision API
  googleVision: {
    apiKey: process.env.GOOGLE_VISION_API_KEY || 'YOUR_VISION_API_KEY',
    endpoint: 'https://vision.googleapis.com/v1/images:annotate',
  },

  // Timeouts (in minutes)
  timeouts: {
    firstReminder: 30,
    finalTimeout: 45, // 30 + 15
  },

  // NGO Info
  ngo: {
    name: 'Hope Foundation',
    coordinatorPhone: '+91 98765 43210',
    coordinatorEmail: 'coordinator@hopefoundation.org',
  },
}
