import { X, MapPin, Clock, User, Send, CheckCircle2, AlertTriangle, MessageCircle } from 'lucide-react'

const urgencyColor = u => u === 'CRITICAL' ? '#ef4444' : u === 'HIGH' ? '#f97316' : '#3b82f6'

export default function AssignmentDetailModal({ card, onClose }) {
  if (!card) return null

  const timeline = [
    { text: 'Assignment created', time: card.minsAgo > 120 ? `${Math.floor(card.minsAgo/60)+1}h ago` : `${card.minsAgo+30}m ago` },
    { text: 'WhatsApp notification sent', time: `${card.minsAgo+25}m ago` },
    ...(card.stage !== 'notified' ? [{ text: 'Volunteer accepted', time: `${card.minsAgo+10}m ago` }] : []),
    ...(card.stage === 'onsite' || card.stage === 'completed' ? [{ text: 'Volunteer confirmed on site', time: `${card.minsAgo}m ago` }] : []),
    ...(card.stage === 'completed' ? [{ text: 'Assignment completed', time: 'Just now' }] : []),
  ]

  const messages = [
    { from: 'system', text: `New assignment: ${card.need}. Please confirm if you can respond. Reply YES to accept.`, time: `${card.minsAgo+25}m ago` },
    ...(card.stage !== 'notified' ? [{ from: 'volunteer', text: 'YES, on my way', time: `${card.minsAgo+10}m ago` }] : []),
    ...(card.stage === 'onsite' ? [{ from: 'volunteer', text: 'Reached the location, starting work now', time: `${card.minsAgo}m ago` }] : []),
    ...(card.stage === 'completed' ? [{ from: 'volunteer', text: 'Done. Task completed successfully.', time: 'Just now' }] : []),
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="assign-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="assign-detail-header">
          <div>
            <h2 className="add-need-title">Assignment Details</h2>
            <span className="kanban-card-urgency" style={{background:`${urgencyColor(card.urgency)}18`,color:urgencyColor(card.urgency),borderColor:`${urgencyColor(card.urgency)}40`,marginTop:6,display:'inline-block'}}>{card.urgency}</span>
          </div>
          <button className="assign-modal-close" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="assign-detail-body">
          <div className="assign-detail-section">
            <h3 className="vol-section-title">Need</h3>
            <div className="assign-detail-grid">
              <div className="drawer-detail"><span className="drawer-detail-label"><AlertTriangle size={13}/> Need</span><span>{card.need}</span></div>
              <div className="drawer-detail"><span className="drawer-detail-label"><MapPin size={13}/> Zone</span><span>{card.zone}</span></div>
            </div>
          </div>

          <div className="assign-detail-section">
            <h3 className="vol-section-title">Volunteer</h3>
            <div className="assign-detail-vol-row">
              <div className="kanban-card-vol-avatar" style={{width:40,height:40,fontSize:'0.85rem'}}>{card.volInitials}</div>
              <div>
                <p style={{color:'#fff',fontWeight:600,fontSize:'0.88rem'}}>{card.volunteer}</p>
                <p style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>{card.zone} · Match: {card.matchPercent}%</p>
              </div>
            </div>
          </div>

          <div className="assign-detail-section">
            <h3 className="vol-section-title"><MessageCircle size={14}/> WhatsApp Conversation</h3>
            <div className="assign-detail-chat">
              {messages.map((m, i) => (
                <div key={i} className={`vol-wa-${m.from === 'system' ? 'sent' : 'reply'}`}>
                  <div className={`vol-wa-bubble vol-wa-bubble--${m.from === 'system' ? 'sent' : 'reply'}`}>
                    {m.from === 'system' && <Send size={12}/>} <span>{m.text}</span>
                  </div>
                  <span className="vol-wa-time">{m.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="assign-detail-section">
            <h3 className="vol-section-title"><Clock size={14}/> Status Timeline</h3>
            <ul className="drawer-timeline">
              {timeline.map((t, i) => (
                <li key={i} className="drawer-timeline-item">
                  <div className="drawer-timeline-dot"/>
                  <div>
                    <p className="drawer-timeline-text">{t.text}</p>
                    <span className="drawer-timeline-time"><Clock size={11}/> {t.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="assign-detail-section">
            <h3 className="vol-section-title">Coordinator Notes</h3>
            <textarea className="assign-detail-notes" placeholder="Add notes about this assignment…" rows={3}/>
          </div>
        </div>

        <div className="drawer-footer">
          {card.stage !== 'completed' && <button className="drawer-btn drawer-btn--resolve"><CheckCircle2 size={13}/> Mark Complete</button>}
          <button className="drawer-btn drawer-btn--secondary">Reassign</button>
          <button className="drawer-btn drawer-btn--danger">Escalate</button>
          <button className="drawer-btn drawer-btn--ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
