import { ArrowRight, Shield, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section
      id="cta"
      className="py-28 relative overflow-hidden"
      style={{ background: '#0a0f1e' }}
    >
      {/* Full-width gradient blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.1) 0%, transparent 70%)' }}
      />

      {/* Decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full opacity-5"
             style={{ border: '1px solid rgba(34,197,94,0.8)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10"
             style={{ border: '1px solid rgba(34,197,94,0.8)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
             style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
          <Zap className="w-3 h-3" />
          Start Coordinating Smarter Today
        </div>

        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
          Ready to coordinate{' '}
          <span className="gradient-text">smarter?</span>
        </h2>

        <p className="text-slate-400 text-xl mb-12 max-w-xl mx-auto leading-relaxed">
          Join NGOs already using NeedMap to cut response times, eliminate manual
          coordination, and maximize impact per volunteer hour.
        </p>

        {/* CTA Button */}
        <Link
          to="/auth"
          id="cta-register-btn"
          className="btn-primary text-lg px-10 py-5 inline-flex items-center gap-3 mx-auto"
          style={{ fontSize: '1.05rem' }}
        >
          Register Your NGO
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-brand-600" />
            Free to get started
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>No credit card required</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>Cancel anytime</span>
        </div>

        {/* Testimonial / social proof */}
        <div className="mt-14 glass-card p-6 max-w-lg mx-auto text-left">
          <p className="text-slate-300 text-sm leading-relaxed italic mb-4">
            &ldquo;NeedMap cut our volunteer deployment time from 3 hours to under 5 minutes.
            The WhatsApp integration means our field workers didn&apos;t need any training at all.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                 style={{ background: 'linear-gradient(135deg, #22c55e, #0d9488)' }}>
              AS
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Amara Singh</p>
              <p className="text-xs text-slate-500">Operations Lead, HelpReach NGO</p>
            </div>
            <div className="ml-auto flex gap-0.5 text-yellow-400 text-sm">
              {'★★★★★'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
