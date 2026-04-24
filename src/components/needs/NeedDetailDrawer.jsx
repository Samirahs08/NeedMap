import { X, MapPin, Calendar, Phone, MessageSquare, User, Clock, AlertTriangle, UserPlus } from 'lucide-react'

const urgencyColor = (u) => u > 80 ? '#ef4444' : u > 50 ? '#f97316' : '#22c55e'
const urgencyLabel = (u) => u > 80 ? 'CRITICAL' : u > 50 ? 'HIGH' : u > 25 ? 'MEDIUM' : 'LOW'

export default function NeedDetailDrawer({ need, onClose, onResolve }) {
  if (!need) return null

  const breakdownBars = [
    { label: 'Severity', value: need.severity, max: 5, color: '#ef4444' },
    { label: 'Frequency', value: need.frequency, max: 5, color: '#f97316' },
    { label: 'Recency', value: need.recency, max: 5, color: '#3b82f6' },
    { label: 'Coverage Gap', value: need.coverage, max: 5, color: '#8b5cf6' },
  ]

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">{need.title}</h2>
            <div className="drawer-badges">
              <span className={`needs-status-badge needs-status--${need.status.toLowerCase().replace(/ /g, '-')}`}>{need.status}</span>
              <span className="drawer-urgency-badge" style={{ background: `${urgencyColor(need.urgency)}18`, color: urgencyColor(need.urgency), borderColor: `${urgencyColor(need.urgency)}40` }}>
                {urgencyLabel(need.urgency)} · {need.urgency}/100
              </span>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="drawer-body">
          {/* Details */}
          <section className="drawer-section">
            <h3 className="drawer-section-title">Details</h3>
            <div className="drawer-detail-grid">
              <div className="drawer-detail"><span className="drawer-detail-label"><AlertTriangle size={13} /> Category</span><span>{need.category}</span></div>
              <div className="drawer-detail"><span className="drawer-detail-label"><MapPin size={13} /> Zone</span><span>{need.zone}</span></div>
              <div className="drawer-detail"><span className="drawer-detail-label"><Calendar size={13} /> Date Logged</span><span>{need.dateLogged}</span></div>
              <div className="drawer-detail"><span className="drawer-detail-label"><MessageSquare size={13} /> Source</span><span>{need.source}</span></div>
              <div className="drawer-detail"><span className="drawer-detail-label"><User size={13} /> People Affected</span><span>{need.peopleAffected}</span></div>
              <div className="drawer-detail"><span className="drawer-detail-label"><Phone size={13} /> Reports</span><span>{need.reports} reports</span></div>
            </div>
            <p className="drawer-description">{need.description}</p>
          </section>

          {/* Urgency Breakdown */}
          <section className="drawer-section">
            <h3 className="drawer-section-title">Urgency Breakdown</h3>
            <div className="drawer-breakdown">
              {breakdownBars.map(b => (
                <div key={b.label} className="drawer-breakdown-row">
                  <span className="drawer-breakdown-label">{b.label}</span>
                  <div className="drawer-breakdown-bar">
                    <div className="drawer-breakdown-fill" style={{ width: `${(b.value / b.max) * 100}%`, background: b.color }} />
                  </div>
                  <span className="drawer-breakdown-val">{b.value}/{b.max}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Field Reports */}
          <section className="drawer-section">
            <h3 className="drawer-section-title">Field Reports ({need.fieldReports.length})</h3>
            {need.fieldReports.length > 0 ? (
              <ul className="drawer-reports-list">
                {need.fieldReports.map(r => (
                  <li key={r.id} className="drawer-report-item">
                    <div className="drawer-report-thumb">📄</div>
                    <div className="drawer-report-info">
                      <p className="drawer-report-sender">{r.sender}</p>
                      <p className="drawer-report-msg">{r.message}</p>
                      <span className="drawer-report-time">{r.timestamp}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="drawer-empty">No field reports yet</p>
            )}
          </section>

          {/* Assigned Volunteers */}
          <section className="drawer-section">
            <h3 className="drawer-section-title">Assigned Volunteers ({need.volunteersAssigned}/{need.volunteersNeeded})</h3>
            <div className="drawer-vol-status">
              <div className="drawer-vol-bar">
                <div style={{ width: `${(need.volunteersAssigned / need.volunteersNeeded) * 100}%`, background: 'var(--brand-gradient)', height: '100%', borderRadius: 4 }} />
              </div>
              <button className="drawer-add-vol-btn"><UserPlus size={13} /> Add Volunteer</button>
            </div>
          </section>

          {/* Activity Log */}
          <section className="drawer-section">
            <h3 className="drawer-section-title">Activity Log</h3>
            <ul className="drawer-timeline">
              {need.activityLog.map((a, i) => (
                <li key={i} className="drawer-timeline-item">
                  <div className="drawer-timeline-dot" />
                  <div>
                    <p className="drawer-timeline-text">{a.text}</p>
                    <span className="drawer-timeline-time"><Clock size={11} /> {a.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Actions */}
        <div className="drawer-footer">
          <button className="drawer-btn drawer-btn--resolve" onClick={() => onResolve(need.id)}>Mark Resolved</button>
          <button className="drawer-btn drawer-btn--secondary">Reassign</button>
          <button className="drawer-btn drawer-btn--danger">Escalate</button>
          <button className="drawer-btn drawer-btn--ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  )
}
