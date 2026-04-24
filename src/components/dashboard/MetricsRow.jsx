import { AlertCircle, Users, CalendarCheck, Clock } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'

export default function MetricsRow({ data }) {
  const responseImproved =
    data.avgResponseTime.hours * 60 + data.avgResponseTime.minutes <
    data.avgResponseLastWeek.hours * 60 + data.avgResponseLastWeek.minutes

  const timeDiffMins = Math.abs(
    (data.avgResponseLastWeek.hours * 60 + data.avgResponseLastWeek.minutes) -
    (data.avgResponseTime.hours * 60 + data.avgResponseTime.minutes)
  )

  const cards = [
    {
      id: 'active-needs',
      label: 'Active Needs',
      value: data.activeNeeds,
      sub: `${data.criticalNeeds} critical urgency`,
      icon: AlertCircle,
      accent: data.criticalNeeds > 10 ? 'red' : 'amber',
      iconBg: data.criticalNeeds > 10 ? 'var(--metric-red-bg)' : 'var(--metric-amber-bg)',
      iconColor: data.criticalNeeds > 10 ? 'var(--metric-red)' : 'var(--metric-amber)',
    },
    {
      id: 'available-volunteers',
      label: 'Available Volunteers',
      value: data.availableVolunteers,
      sub: `${data.totalVolunteers} total registered`,
      icon: Users,
      accent: 'green',
      iconBg: 'var(--metric-green-bg)',
      iconColor: 'var(--metric-green)',
    },
    {
      id: 'assignments-today',
      label: 'Assignments Today',
      value: data.assignmentsToday,
      sub: `${data.completedToday} completed · ${data.inProgressToday} in progress`,
      icon: CalendarCheck,
      accent: 'blue',
      iconBg: 'var(--metric-blue-bg)',
      iconColor: 'var(--metric-blue)',
    },
    {
      id: 'avg-response-time',
      label: 'Avg Response Time',
      value: `${data.avgResponseTime.hours}h ${data.avgResponseTime.minutes}m`,
      sub: responseImproved
        ? `${timeDiffMins}m faster than last week`
        : `${timeDiffMins}m slower than last week`,
      icon: Clock,
      accent: responseImproved ? 'green' : 'red',
      iconBg: responseImproved ? 'var(--metric-green-bg)' : 'var(--metric-red-bg)',
      iconColor: responseImproved ? 'var(--metric-green)' : 'var(--metric-red)',
      trend: responseImproved ? 'up' : 'down',
    },
  ]

  return (
    <div className="metrics-row">
      {cards.map((card) => (
        <div className="metric-card" key={card.id} id={card.id}>
          <div className="metric-card-header">
            <span className="metric-card-label">{card.label}</span>
            <div className="metric-card-icon" style={{ background: card.iconBg }}>
              <card.icon size={18} style={{ color: card.iconColor }} />
            </div>
          </div>
          <p className="metric-card-value">{card.value}</p>
          <div className="metric-card-sub">
            {card.trend && (
              card.trend === 'up'
                ? <TrendingDown size={14} style={{ color: 'var(--metric-green)' }} />
                : <TrendingUp size={14} style={{ color: 'var(--metric-red)' }} />
            )}
            <span className={`metric-accent--${card.accent}`}>{card.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
