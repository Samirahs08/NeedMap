import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { skillsList, languagesList, zonesList, daysList } from '../../services/dataService'

export default function AddVolunteerModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '', phone: '', skills: [], homeZone: '', languages: [], weeklyLimit: 20,
    availDays: ['Mon','Tue','Wed','Thu','Fri'], availHoursFrom: '09:00', availHoursTo: '18:00', notes: '',
  })
  const [toast, setToast] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleArr = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.homeZone) return
    onSubmit(form)
    setToast(`WhatsApp welcome message sent to ${form.name}`)
    setTimeout(() => { setToast(''); onClose() }, 2200)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-vol-modal" onClick={e => e.stopPropagation()}>
        <div className="add-need-header">
          <div>
            <h2 className="add-need-title">Register New Volunteer</h2>
            <p className="add-need-subtitle">Add a volunteer to the coordination system</p>
          </div>
          <button className="assign-modal-close" onClick={onClose}><X size={20}/></button>
        </div>
        <form className="add-need-form" onSubmit={handleSubmit}>
          <div className="add-need-row">
            <div className="add-need-field">
              <label>Full Name *</label>
              <input type="text" placeholder="e.g. Ravi Kumar" value={form.name} onChange={e => set('name', e.target.value)} required/>
            </div>
            <div className="add-need-field">
              <label>Phone Number *</label>
              <input type="text" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} required/>
            </div>
          </div>
          <div className="add-need-field">
            <label>Skills (select multiple)</label>
            <div className="vol-multi-select">
              {skillsList.map(s => (
                <button type="button" key={s} className={`vol-chip ${form.skills.includes(s) ? 'vol-chip--active' : ''}`} onClick={() => toggleArr('skills', s)}>
                  {form.skills.includes(s) && <Check size={12}/>} {s}
                </button>
              ))}
            </div>
          </div>
          <div className="add-need-row">
            <div className="add-need-field">
              <label>Home Zone *</label>
              <select value={form.homeZone} onChange={e => set('homeZone', e.target.value)} required>
                <option value="">Select zone</option>
                {zonesList.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div className="add-need-field">
              <label>Weekly Hour Limit</label>
              <input type="number" min="5" max="50" value={form.weeklyLimit} onChange={e => set('weeklyLimit', e.target.value)}/>
            </div>
          </div>
          <div className="add-need-field">
            <label>Languages Spoken</label>
            <div className="vol-multi-select">
              {languagesList.map(l => (
                <button type="button" key={l} className={`vol-chip ${form.languages.includes(l) ? 'vol-chip--active' : ''}`} onClick={() => toggleArr('languages', l)}>
                  {form.languages.includes(l) && <Check size={12}/>} {l}
                </button>
              ))}
            </div>
          </div>
          <div className="add-need-field">
            <label>Availability Days</label>
            <div className="vol-days-row">
              {daysList.map(d => (
                <button type="button" key={d} className={`vol-day-btn ${form.availDays.includes(d) ? 'vol-day-btn--active' : ''}`} onClick={() => toggleArr('availDays', d)}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="add-need-row">
            <div className="add-need-field">
              <label>Available From</label>
              <input type="time" value={form.availHoursFrom} onChange={e => set('availHoursFrom', e.target.value)}/>
            </div>
            <div className="add-need-field">
              <label>Available Until</label>
              <input type="time" value={form.availHoursTo} onChange={e => set('availHoursTo', e.target.value)}/>
            </div>
          </div>
          <div className="add-need-field">
            <label>Notes (optional)</label>
            <textarea rows={2} placeholder="Any special notes about this volunteer…" value={form.notes} onChange={e => set('notes', e.target.value)}/>
          </div>
          <div className="add-need-actions">
            <button type="button" className="drawer-btn drawer-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="needs-add-btn">Register Volunteer</button>
          </div>
        </form>
        {toast && <div className="assign-toast"><Check size={18}/><span>{toast}</span></div>}
      </div>
    </div>
  )
}
