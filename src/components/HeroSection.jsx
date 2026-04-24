import { ArrowRight, ChevronDown, Smartphone, Cpu, LayoutDashboard, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const flowSteps = [
  { icon: <Smartphone className="w-5 h-5" />, label: 'Paper Form' },
  { icon: <MessageCircle className="w-5 h-5" />, label: 'WhatsApp' },
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { icon: <Cpu className="w-5 h-5" />, label: 'Volunteer' },
]

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d2818 55%, #0a0f1e 100%)' }}
    >

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.4) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '2s' }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                 style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Smart NGO Platform — Free to Start
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-balance mb-6">
              Turn Scattered Community Data into{' '}
              <span className="gradient-text">Instant Volunteer Action</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
              NeedMap connects field reports, urgency intelligence, and volunteer coordination
              into one real-time system for NGOs — from WhatsApp photo to deployed volunteer
              in under 2 minutes.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth" id="hero-cta-primary" className="btn-primary text-base px-8 py-4">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" id="hero-cta-secondary" className="btn-ghost text-base px-8 py-4">
                See How It Works
                <ChevronDown className="w-5 h-5" />
              </a>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="text-brand-400">✓</span> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-brand-400">✓</span> Works on any phone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-brand-400">✓</span> Set up in minutes
              </span>
            </div>
          </div>

          {/* Right — flow visual */}
          <div className="flex justify-center lg:justify-end animate-float">
            <div className="relative">
              {/* Main card */}
              <div className="glass-card p-8 w-full max-w-md">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-5">
                  How a need becomes action
                </p>

                <div className="flex flex-col gap-3">
                  {flowSteps.map((step, i) => (
                    <div key={i} className="relative">
                      <div
                        className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        {/* Step number + icon */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                               style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                            {i + 1}
                          </div>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-brand-400"
                               style={{ background: 'rgba(34,197,94,0.1)' }}>
                            {step.icon}
                          </div>
                        </div>
                        <span className="font-semibold text-white">{step.label}</span>

                        {/* Animated right arrow */}
                        {i < flowSteps.length - 1 && (
                          <ArrowRight className="ml-auto w-4 h-4 text-brand-500 animate-pulse" />
                        )}
                        {i === flowSteps.length - 1 && (
                          <span className="ml-auto text-xs font-semibold text-brand-400 bg-brand-500/10 px-2 py-1 rounded-full">
                            Deployed ✓
                          </span>
                        )}
                      </div>

                      {/* Connector line */}
                      {i < flowSteps.length - 1 && (
                        <div className="absolute left-6 -bottom-1.5 w-0.5 h-3 bg-brand-600/60" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Timer badge */}
                <div className="mt-5 flex items-center justify-between p-3 rounded-xl"
                     style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <span className="text-sm text-slate-400">Average response time</span>
                  <span className="font-display font-bold text-brand-400 text-lg">~2 min</span>
                </div>
              </div>

              {/* Floating notification card */}
              <div
                className="absolute -top-4 -right-6 glass-card p-3 w-52 shadow-glow-sm"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-sm">
                    💬
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">WhatsApp Bot</p>
                    <p className="text-[10px] text-slate-400">Need logged automatically</p>
                  </div>
                </div>
              </div>

              {/* Floating map card */}
              <div
                className="absolute -bottom-4 -left-6 glass-card p-3 w-44 shadow-glow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="text-xs font-semibold text-white">3 needs nearby</p>
                    <p className="text-[10px] text-brand-400">High urgency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce">
        <span className="text-xs">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  )
}
