import { useState } from 'react'
import { X, CheckCircle2, MessageCircle } from 'lucide-react'

export default function AssignModal({ need, volunteers, onClose }) {
  const [confirmVol, setConfirmVol] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  if (!need) return null

  function handleSelect(vol) {
    setConfirmVol(vol)
  }

  function handleConfirm() {
    setToastMsg(`Notification sent to ${confirmVol.name}`)
    setConfirmVol(null)
    setTimeout(() => {
      setToastMsg('')
      onClose()
    }, 2200)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="assign-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="assign-modal-header">
          <div>
            <h2 className="assign-modal-title">Assign Volunteer</h2>
            <p className="assign-modal-subtitle">Select the best match for this need</p>
          </div>
          <button className="assign-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Need Details */}
        <div className="assign-modal-need">
          <div className="assign-modal-need-row">
            <span className="assign-modal-need-label">Need:</span>
            <span className="assign-modal-need-value">{need.title}</span>
          </div>
          <div className="assign-modal-need-row">
            <span className="assign-modal-need-label">Zone:</span>
            <span className="assign-modal-need-value">{need.zone}</span>
          </div>
          <div className="assign-modal-need-row">
            <span className="assign-modal-need-label">Urgency:</span>
            <span className="assign-modal-need-value" style={{
              color: (need.urgency || 0) > 80 ? '#ef4444' : (need.urgency || 0) > 50 ? '#f97316' : '#22c55e',
              fontWeight: 700,
            }}>
              {need.urgency}/100
            </span>
          </div>
        </div>

        {/* Volunteer list */}
        <div className="assign-modal-list-header">
          <h3 className="assign-modal-list-title">Best Matched Volunteers</h3>
        </div>
        <ul className="assign-modal-list">
          {volunteers.map((vol) => (
            <li key={vol.id} className="assign-modal-vol">
              <div className="assign-modal-vol-left">
                <div className="assign-modal-vol-avatar">{vol.initials}</div>
                <div className="assign-modal-vol-info">
                  <p className="assign-modal-vol-name">{vol.name}</p>
                  <div className="assign-modal-vol-meta">
                    <span className="assign-modal-vol-match">{vol.matchPercent}% match</span>
                    <span className="assign-modal-vol-dot">·</span>
                    <span>{vol.distance}</span>
                    <span className="assign-modal-vol-dot">·</span>
                    <span className="assign-modal-vol-avail">{vol.availability}</span>
                  </div>
                  <div className="assign-modal-vol-skills">
                    {vol.skills.map((s) => (
                      <span key={s} className="volunteer-skill-tag">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="assign-modal-select-btn" onClick={() => handleSelect(vol)}>
                Select
              </button>
            </li>
          ))}
        </ul>

        {/* Confirm dialog */}
        {confirmVol && (
          <div className="assign-confirm-overlay" onClick={() => setConfirmVol(null)}>
            <div className="assign-confirm-dialog" onClick={(e) => e.stopPropagation()}>
              <MessageCircle size={28} className="assign-confirm-icon" />
              <p className="assign-confirm-text">
                Send WhatsApp notification to <strong>{confirmVol.name}</strong>?
              </p>
              <div className="assign-confirm-actions">
                <button className="assign-confirm-cancel" onClick={() => setConfirmVol(null)}>Cancel</button>
                <button className="assign-confirm-send" onClick={handleConfirm}>
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMsg && (
          <div className="assign-toast">
            <CheckCircle2 size={18} />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  )
}
