import { BookOpen, Phone, Eye } from 'lucide-react'

const painPoints = [
  {
    id: 'pain-data',
    icon: <BookOpen className="w-7 h-7" />,
    emoji: '📓',
    title: 'Data sits in notebooks for days',
    description: 'Field workers fill paper forms that travel by hand to coordinators. By the time data is entered, the window to act has closed.',
    tag: 'Data Lag',
  },
  {
    id: 'pain-calls',
    icon: <Phone className="w-7 h-7" />,
    emoji: '📞',
    title: 'Coordinators spend hours calling volunteers',
    description: 'Manual phone-based volunteer deployment is slow, error-prone, and completely unscalable when multiple needs strike at once.',
    tag: 'Manual Process',
  },
  {
    id: 'pain-picture',
    icon: <Eye className="w-7 h-7" />,
    emoji: '🔍',
    title: 'High urgency needs get missed entirely',
    description: 'With no central picture of active needs, the most critical situations go unnoticed while resources flow to the loudest voices.',
    tag: 'Blind Spots',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problem"
      className="py-24 relative overflow-hidden"
      style={{ background: '#080c18' }}
    >
      {/* Subtle divider gradient */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="section-label">The Challenge</p>
          <h2 className="section-heading text-4xl sm:text-5xl mb-5">
            The Problem Every NGO Faces
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Without real-time data and smart coordination tools, even the
            most dedicated NGOs operate half-blind — causing delays that cost lives.
          </p>
        </div>

        {/* Pain point cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {painPoints.map((p, i) => (
            <div
              key={p.id}
              id={p.id}
              className="glass-card p-8 relative overflow-hidden group"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Background accent */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500"
                style={{ background: 'radial-gradient(circle, #ef4444, transparent)', transform: 'translate(30%, -30%)' }}
              />

              {/* Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5"
                   style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {p.tag}
              </div>

              {/* Emoji */}
              <div className="text-4xl mb-4">{p.emoji}</div>

              {/* Content */}
              <h3 className="font-display font-bold text-xl text-white mb-3 leading-snug">
                &ldquo;{p.title}&rdquo;
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {p.description}
              </p>

              {/* Bottom line accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                   style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)' }} />
            </div>
          ))}
        </div>

        {/* Bridge to solution */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-base">
            NeedMap was built specifically to solve all three problems — simultaneously.
          </p>
          <a href="#how-it-works" className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 font-semibold text-sm mt-2 transition-colors">
            See the solution ↓
          </a>
        </div>
      </div>
    </section>
  )
}
