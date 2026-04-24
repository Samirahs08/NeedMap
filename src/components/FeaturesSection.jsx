import { MessageCircle, ScanLine, TrendingUp, Users, Map, FileBarChart } from 'lucide-react'

const features = [
  {
    id: 'feat-whatsapp',
    icon: <MessageCircle className="w-7 h-7" />,
    color: '#25D366',
    bg: 'rgba(37,211,102,0.1)',
    border: 'rgba(37,211,102,0.2)',
    title: 'WhatsApp Intake',
    description: 'Accept field reports via WhatsApp photo. No app download needed for field workers. Works on any basic phone with WhatsApp.',
    tag: 'Zero Friction',
  },
  {
    id: 'feat-ocr',
    icon: <ScanLine className="w-7 h-7" />,
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.2)',
    title: 'AI OCR Parsing',
    description: 'Automatically reads handwritten forms and extracts structured data — beneficiary info, need category, location, and urgency level.',
    tag: 'Google Vision AI',
  },
  {
    id: 'feat-urgency',
    icon: <TrendingUp className="w-7 h-7" />,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
    title: 'Urgency Scoring',
    description: 'Dynamic formula ranks needs by severity, frequency, recency and coverage gap. The dashboard always shows what matters most right now.',
    tag: 'Real-Time Engine',
  },
  {
    id: 'feat-matching',
    icon: <Users className="w-7 h-7" />,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.2)',
    title: 'Smart Matching',
    description: 'Matches volunteers on skill set, geographic proximity, current availability and fatigue score to maximize impact and prevent burnout.',
    tag: '91% Accuracy',
  },
  {
    id: 'feat-map',
    icon: <Map className="w-7 h-7" />,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.2)',
    title: 'Live Map',
    description: 'See all active needs plotted geographically with urgency color coding. Instantly understand which zones need attention without reading a table.',
    tag: 'Leaflet.js',
  },
  {
    id: 'feat-reports',
    icon: <FileBarChart className="w-7 h-7" />,
    color: '#fb7185',
    bg: 'rgba(251,113,133,0.1)',
    border: 'rgba(251,113,133,0.2)',
    title: 'Auto Reports',
    description: 'Weekly impact reports generated automatically and emailed to coordinators and donors — response times, needs resolved, volunteer hours, coverage maps.',
    tag: 'Donor Ready',
  },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 relative overflow-hidden"
      style={{ background: '#080c18' }}
    >
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(34,197,94,0.05) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="section-label">Platform Features</p>
          <h2 className="section-heading text-4xl sm:text-5xl mb-5">
            Everything Your NGO Needs
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Six powerful capabilities working together to transform how your
            organization identifies, prioritizes, and responds to community needs.
          </p>
        </div>

        {/* Feature grid — 3x2 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.id}
              id={f.id}
              className="glass-card p-7 group relative overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${f.color}, transparent)`, filter: 'blur(20px)' }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ background: f.bg, border: `1px solid ${f.border}`, color: f.color }}
              >
                {f.icon}
              </div>

              {/* Tag */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: f.bg, color: f.color, border: `1px solid ${f.border}` }}
              >
                {f.tag}
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-xl text-white mb-3">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                {f.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
