import { AlertCircle, CheckCircle2, UserCheck, Info } from 'lucide-react'

const iconMap = {
  critical: { Icon: AlertCircle, className: 'activity-icon--critical' },
  resolved: { Icon: CheckCircle2, className: 'activity-icon--resolved' },
  volunteer: { Icon: UserCheck, className: 'activity-icon--volunteer' },
  info: { Icon: Info, className: 'activity-icon--info' },
}

export default function ActivityFeed({ items }) {
  return (
    <div className="dashboard-card activity-feed-card" id="activity-feed">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Recent Activity</h2>
        <span className="activity-live-dot" />
      </div>
      <ul className="activity-list">
        {items.map((item) => {
          const { Icon, className } = iconMap[item.type] || iconMap.info
          return (
            <li key={item.id} className="activity-item">
              <div className={`activity-icon ${className}`}>
                <Icon size={14} />
              </div>
              <div className="activity-content">
                <p className="activity-text">{item.text}</p>
                <span className="activity-time">{item.time}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
