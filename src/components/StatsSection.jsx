import { useEffect, useRef, useState } from 'react'

const stats = [
  {
    id: 'stat-time',
    value: '2',
    suffix: ' min',
    label: 'Average volunteer response time',
    description: 'From field photo to deployed volunteer',
    emoji: '⚡',
  },
  {
    id: 'stat-accuracy',
    value: '91',
    suffix: '%',
    label: 'Volunteer match accuracy',
    description: 'Skill + proximity + availability scoring',
    emoji: '🎯',
  },
  {
    id: 'stat-downloads',
    value: '0',
    suffix: '',
    label: 'App downloads needed',
    description: 'Field workers just use WhatsApp',
    emoji: '📱',
  },
  {
    id: 'stat-phone',
    value: '100',
    suffix: '%',
    label: 'Works on any basic phone',
    description: 'If it has WhatsApp, it works',
    emoji: '✅',
  },
]

function AnimatedNumber({ target, suffix, inView }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    const num = parseInt(target, 10)
    const duration = 1800
    const steps = 60
    const increment = num / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), num))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span>
      {current}
      {suffix}
    </span>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="stats"
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d2818 0%, #0a0f1e 50%, #0a1a1a 100%)' }}
    >
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.5), rgba(20,184,166,0.5), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.5), rgba(20,184,166,0.5), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/5">
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              id={stat.id}
              className="flex flex-col items-center text-center px-8 py-6 group"
            >
              {/* Emoji icon */}
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.emoji}
              </div>

              {/* Animated number */}
              <div
                className="font-display font-bold text-5xl mb-2"
                style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>

              {/* Label */}
              <p className="font-semibold text-white text-sm mb-1">
                {stat.label}
              </p>

              {/* Sub-description */}
              <p className="text-slate-500 text-xs leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
