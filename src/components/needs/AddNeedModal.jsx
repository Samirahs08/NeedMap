import { useState } from 'react'
import { X } from 'lucide-react'
import { categoriesList, zonesList } from '../../data/needsData'

const sourceOptions = ['Field Visit', 'Phone Call', 'Community Leader', 'Other']

export default function AddNeedModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '', category: '', zone: '', location: '', peopleAffected: '', severity: 3, description: '', source: '', volunteersNeeded: 2,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.zone) return
    onSubmit({ ...form, peopleAffected: Number(form.peopleAffected) || 0, volunteersNeeded: Number(form.volunteersNeeded) || 2, severity: Number(form.severity) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-need-modal" onClick={e => e.stopPropagation()}>
        <div className="add-need-header">
          <div>
            <h2 className="add-need-title">Log New Need</h2>
            <p className="add-need-subtitle">Manually add a community need to the system</p>
          </div>
          <button className="assign-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="add-need-form" onSubmit={handleSubmit}>
          <div className="add-need-field">
            <label>Need Title *</label>
            <input type="text" placeholder="e.g. Medical supplies needed in Zone 4" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div className="add-need-row">
            <div className="add-need-field">
              <label>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} required>
                <option value="">Select category</option>
                {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="add-need-field">
              <label>Zone / Area *</label>
              <select value={form.zone} onChange={e => set('zone', e.target.value)} required>
                <option value="">Select zone</option>
                {zonesList.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
          </div>

          <div className="add-need-field">
            <label>Specific Location Description</label>
            <textarea rows={2} placeholder="Landmarks, street name, building details…" value={form.location} onChange={e => set('location', e.target.value)} />
          </div>

          <div className="add-need-row">
            <div className="add-need-field">
              <label>People Affected</label>
              <input type="number" min="0" placeholder="0" value={form.peopleAffected} onChange={e => set('peopleAffected', e.target.value)} />
            </div>
            <div className="add-need-field">
              <label>Volunteers Needed</label>
              <input type="number" min="1" max="20" value={form.volunteersNeeded} onChange={e => set('volunteersNeeded', e.target.value)} />
            </div>
          </div>

          <div className="add-need-field">
            <label>Severity (1 = Low, 5 = Critical)</label>
            <div className="add-need-severity">
              {[1, 2, 3, 4, 5].map(v => (
                <label key={v} className={`severity-radio ${form.severity === v ? 'severity-radio--active' : ''}`}>
                  <input type="radio" name="severity" value={v} checked={form.severity === v} onChange={() => set('severity', v)} />
                  <span className="severity-num">{v}</span>
                  <span className="severity-label">{['Low', 'Moderate', 'Significant', 'High', 'Critical'][v - 1]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="add-need-field">
            <label>Description</label>
            <textarea rows={3} placeholder="Describe the situation, people affected, and resources needed…" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="add-need-field">
            <label>Source</label>
            <select value={form.source} onChange={e => set('source', e.target.value)}>
              <option value="">Select source</option>
              {sourceOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="add-need-actions">
            <button type="button" className="drawer-btn drawer-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="needs-add-btn">Log Need</button>
          </div>
        </form>
      </div>
    </div>
  )
}
