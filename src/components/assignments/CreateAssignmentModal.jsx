import { useState } from 'react'
import { X, Search, Check, Send, ArrowRight, MapPin, AlertTriangle } from 'lucide-react'
import { unassignedNeeds, matchedVolunteers } from '../../data/assignmentsData'

const urgencyColor = u => u > 80 ? '#ef4444' : u > 50 ? '#f97316' : '#22c55e'

export default function CreateAssignmentModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [selectedNeed, setSelectedNeed] = useState(null)
  const [selectedVol, setSelectedVol] = useState(null)
  const [note, setNote] = useState('')
  const [toast, setToast] = useState('')
  const [searchNeed, setSearchNeed] = useState('')

  const filteredNeeds = unassignedNeeds.filter(n => n.title.toLowerCase().includes(searchNeed.toLowerCase()))

  const handleConfirm = () => {
    setToast(`WhatsApp notification sent to ${selectedVol.name}`)
    setTimeout(() => { setToast(''); onClose() }, 2200)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-assign-modal" onClick={e => e.stopPropagation()}>
        <div className="add-need-header">
          <div>
            <h2 className="add-need-title">Create Assignment</h2>
            <p className="add-need-subtitle">Step {step} of 3 — {step===1?'Select Need':step===2?'Select Volunteer':'Confirm & Send'}</p>
          </div>
          <button className="assign-modal-close" onClick={onClose}><X size={20}/></button>
        </div>

        {/* Step indicator */}
        <div className="create-steps">
          {[1,2,3].map(s => (
            <div key={s} className={`create-step ${step>=s?'create-step--done':''} ${step===s?'create-step--active':''}`}>
              <div className="create-step-dot">{step>s?<Check size={12}/>:s}</div>
              <span>{s===1?'Need':s===2?'Volunteer':'Confirm'}</span>
            </div>
          ))}
          <div className="create-steps-line"/>
        </div>

        <div className="create-body">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="needs-search-wrap" style={{marginBottom:12}}>
                <Search size={15} className="needs-search-icon"/>
                <input type="text" className="needs-search-input" placeholder="Search active needs…" value={searchNeed} onChange={e=>setSearchNeed(e.target.value)}/>
              </div>
              <div className="create-need-list">
                {filteredNeeds.map(n => (
                  <div key={n.id} className={`create-need-item ${selectedNeed?.id===n.id?'create-need-item--selected':''}`} onClick={()=>setSelectedNeed(n)}>
                    <div>
                      <p className="create-need-title">{n.title}</p>
                      <span className="create-need-zone"><MapPin size={11}/> {n.zone}</span>
                    </div>
                    <span className="create-need-urgency" style={{color:urgencyColor(n.urgency)}}>{n.urgency}/100</span>
                  </div>
                ))}
              </div>
              <div className="create-nav">
                <div/>
                <button className="needs-add-btn" disabled={!selectedNeed} onClick={()=>setStep(2)}>Next <ArrowRight size={14}/></button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <p className="create-selected-badge"><AlertTriangle size={13}/> {selectedNeed.title} — Urgency {selectedNeed.urgency}</p>
              <h3 className="vol-section-title" style={{marginTop:12}}>Best Matched Volunteers</h3>
              <div className="create-vol-list">
                {matchedVolunteers.map(v => (
                  <div key={v.id} className={`assign-modal-vol ${selectedVol?.id===v.id?'assign-modal-vol--selected':''}`} onClick={()=>setSelectedVol(v)}>
                    <div className="assign-modal-vol-left">
                      <div className="assign-modal-vol-avatar">{v.initials}</div>
                      <div className="assign-modal-vol-info">
                        <p className="assign-modal-vol-name">{v.name}</p>
                        <div className="assign-modal-vol-meta">
                          <span className="assign-modal-vol-match">{v.matchPercent}% match</span>
                          <span className="assign-modal-vol-dot">·</span>
                          <span>{v.distance}</span>
                          <span className="assign-modal-vol-dot">·</span>
                          <span className="assign-modal-vol-avail">{v.availability}</span>
                        </div>
                        <div className="assign-modal-vol-skills">{v.skills.map(s=><span key={s} className="volunteer-skill-tag">{s}</span>)}</div>
                      </div>
                    </div>
                    {selectedVol?.id===v.id && <Check size={18} style={{color:'#22c55e'}}/>}
                  </div>
                ))}
              </div>
              <div className="create-nav">
                <button className="drawer-btn drawer-btn--ghost" onClick={()=>setStep(1)}>Back</button>
                <button className="needs-add-btn" disabled={!selectedVol} onClick={()=>setStep(3)}>Next <ArrowRight size={14}/></button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h3 className="vol-section-title">Assignment Summary</h3>
              <div className="create-summary">
                <div className="create-summary-row"><span>Need:</span><span>{selectedNeed.title}</span></div>
                <div className="create-summary-row"><span>Zone:</span><span>{selectedNeed.zone}</span></div>
                <div className="create-summary-row"><span>Urgency:</span><span style={{color:urgencyColor(selectedNeed.urgency),fontWeight:700}}>{selectedNeed.urgency}/100</span></div>
                <div className="create-summary-row"><span>Volunteer:</span><span>{selectedVol.name}</span></div>
                <div className="create-summary-row"><span>Match:</span><span style={{color:'#22c55e'}}>{selectedVol.matchPercent}%</span></div>
                <div className="create-summary-row"><span>Distance:</span><span>{selectedVol.distance}</span></div>
              </div>
              <div className="add-need-field" style={{marginTop:14}}>
                <label>Add note to WhatsApp message (optional)</label>
                <textarea rows={2} placeholder="Any additional instructions for the volunteer…" value={note} onChange={e=>setNote(e.target.value)}/>
              </div>
              <div className="create-nav">
                <button className="drawer-btn drawer-btn--ghost" onClick={()=>setStep(2)}>Back</button>
                <button className="needs-add-btn" onClick={handleConfirm}><Send size={14}/> Send Notification</button>
              </div>
            </div>
          )}
        </div>

        {toast && <div className="assign-toast"><Check size={18}/><span>{toast}</span></div>}
      </div>
    </div>
  )
}
