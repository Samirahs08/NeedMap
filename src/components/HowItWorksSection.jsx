import { Camera, Bot, Zap, Bell } from 'lucide-react'

const steps = [
  {
    id: 'step-capture',
    number: 1,
    icon: <Camera className="w-6 h-6" />,
    title: 'Capture in the Field',
    description: 'Field worker photographs a paper form and sends it to your NGO\'s dedicated WhatsApp number. No app download. No training required.',
    detail: 'Works on any basic smartphone',
  },
  {
    id: 'step-parse',
    number: 2,
    icon: <Bot className="w-6 h-6" />,
    title: 'AI Reads the Form',
    description: 'Google Cloud Vision OCR extracts all data from the photo — beneficiary details, location, need category, and severity — and logs it instantly to the database.',
    detail: 'Powered by Google Cloud Vision',
  },
  {
    id: 'step-score',
    number: 3,
    icon: <Zap className="w-6 h-6" />,
    title: 'Urgency Score Calculated',
    description: 'NeedMap\'s urgency engine scores each need in real time using severity, frequency, recency and coverage factors. Coordinators see a live ranked priority list.',
    detail: 'Dynamic real-time scoring',
  },
  {
    id: 'step-deploy',
    number: 4,
    icon: <Bell className="w-6 h-6" />,
    title: 'Volunteer Notified Instantly',
    description: 'The best-matched available volunteer receives a WhatsApp message with details. They reply YES or NO. The system logs the response and tracks the deployment.',
    detail: 'Smart skill + proximity matching',
  },
]

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 relative overflow-hidden"
      style={{ background: '#0a0f1e' }}
    >
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-20">
          <p className="section-label">The Process</p>
          <h2 className="section-heading text-4xl sm:text-5xl mb-5">
            How NeedMap Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From paper form to deployed volunteer — fully automated, fully auditable,
            in under 2 minutes.
          </p>
        </div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px"
               style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(34,197,94,0.3) 20%, rgba(34,197,94,0.3) 80%, transparent 95%)' }} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={step.id} id={step.id} className="flex flex-col items-center text-center group">
                {/* Number badge */}
                <div className="step-badge mb-6 relative group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                  {/* Glow ring on hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{ boxShadow: '0 0 24px rgba(34,197,94,0.6)' }} />
                </div>

                {/* Icon box */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                     style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
                  {step.icon}
                </div>

                {/* Text */}
                <h3 className="font-display font-bold text-lg text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Detail chip */}
                <span className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.15)' }}>
                  {step.detail}
                </span>

                {/* Mobile connector arrow */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden mt-4 text-brand-600 text-2xl">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <div className="mt-16 mx-auto max-w-2xl glass-card p-6 text-center">
          <p className="text-white font-semibold mb-1">
            End-to-end automated — zero manual data entry for coordinators
          </p>
          <p className="text-slate-400 text-sm">
            Every action is timestamped, logged, and available in the dashboard and
            weekly donor reports.
          </p>
        </div>
      </div>
    </section>
  )
}
