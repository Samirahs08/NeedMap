import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const tabs = [
  { key: 'available', label: 'Available' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'rest', label: 'Rest Mode' },
]

export default function VolunteerStatusBoard({ data, onAssignClick }) {
  const [activeTab, setActiveTab] = useState('available')

  const list = data[activeTab] || []

  return (
    <div className="dashboard-card volunteer-board" id="volunteer-status-board">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Volunteer Availability</h2>
      </div>

      {/* Tabs */}
      <div className="volunteer-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`volunteer-tab ${activeTab === tab.key ? 'volunteer-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="volunteer-tab-count">{(data[tab.key] || []).length}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="volunteer-list">
        {list.map((vol) => (
          <li key={vol.id} className="volunteer-item">
            <div className="volunteer-avatar" data-status={activeTab}>
              {vol.initials}
            </div>
            <div className="volunteer-info">
              <p className="volunteer-name">{vol.name}</p>
              <p className="volunteer-status-text">{vol.status}</p>
              <div className="volunteer-skills">
                {vol.skills.map((s) => (
                  <span key={s} className="volunteer-skill-tag">{s}</span>
                ))}
              </div>
            </div>
            {activeTab === 'available' && (
              <button
                className="volunteer-assign-btn"
                onClick={() => onAssignClick && onAssignClick(vol)}
              >
                Assign
              </button>
            )}
          </li>
        ))}
      </ul>

      <Link to="/volunteers" className="dashboard-card-footer-link">
        View All <ArrowRight size={14} />
      </Link>
    </div>
  )
}
