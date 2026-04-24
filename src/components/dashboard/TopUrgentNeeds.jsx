import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const badgeClasses = {
  CRITICAL: 'urgency-badge--critical',
  HIGH: 'urgency-badge--high',
  MEDIUM: 'urgency-badge--medium',
}

export default function TopUrgentNeeds({ needs, onAssignClick }) {
  return (
    <div className="dashboard-card urgent-needs-card" id="top-urgent-needs">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Needs Requiring Immediate Action</h2>
      </div>
      <ul className="urgent-needs-list">
        {needs.map((need) => (
          <li key={need.id} className="urgent-need-item">
            <div className="urgent-need-top">
              <span className={`urgency-badge ${badgeClasses[need.badge]}`}>{need.badge}</span>
              <span className="urgent-need-score">{need.urgency}<span className="urgent-need-score-max">/100</span></span>
            </div>
            <p className="urgent-need-title">{need.title}</p>
            <p className="urgent-need-zone">{need.zone}</p>
            {/* Progress bar */}
            <div className="urgency-progress-bar">
              <div
                className="urgency-progress-fill"
                style={{
                  width: `${need.urgency}%`,
                  background: need.urgency > 80
                    ? 'linear-gradient(90deg, #ef4444, #f87171)'
                    : need.urgency > 50
                    ? 'linear-gradient(90deg, #f97316, #fb923c)'
                    : 'linear-gradient(90deg, #22c55e, #4ade80)',
                }}
              />
            </div>
            <button
              className="urgent-need-assign-btn"
              onClick={() => onAssignClick && onAssignClick(need)}
            >
              Assign Now
            </button>
          </li>
        ))}
      </ul>
      <Link to="/needs" className="dashboard-card-footer-link">
        View All Needs <ArrowRight size={14} />
      </Link>
    </div>
  )
}
