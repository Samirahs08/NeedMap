import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import { useAuth } from '../context/AuthContext'
import { fetchVolunteers } from '../services/dataService'
import { ArrowLeft, Phone, Globe, MapPin, Shield, Star, Clock, MessageCircle, AlertTriangle, CheckCircle2, Send, Loader2 } from 'lucide-react'
import '../styles/volunteers.css'

const statusColors = { Available:'#22c55e', Assigned:'#f59e0b', 'Rest Mode':'#64748b' }
const daysList = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function VolunteerProfilePage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [vol, setVol] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    if (!currentUser) return
    fetchVolunteers(currentUser.uid).then(data => {
      const found = data.find(v => v.id === id)
      setVol(found || null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [currentUser, id])

  if (loading) return (
    <div className="dashboard-layout"><Sidebar/><div className="dashboard-main"><TopBar title="Volunteer Profile"/>
      <div className="dashboard-content" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
        <div style={{textAlign:'center',color:'rgba(255,255,255,0.5)'}}><Loader2 size={32} className="needs-spinner" /><p style={{marginTop:12,fontSize:14}}>Loading profile…</p></div>
      </div>
    </div></div>
  )

  if (!vol) return (
    <div className="dashboard-layout"><Sidebar/><div className="dashboard-main"><TopBar title="Volunteer Profile"/>
      <div className="dashboard-content" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8'}}>Volunteer not found</div>
    </div></div>
  )

  const hoursPercent = vol.weeklyLimit ? Math.round((vol.hoursUsed / vol.weeklyLimit) * 100) : 0
  const hoursColor = hoursPercent >= 100 ? '#ef4444' : hoursPercent >= 80 ? '#f59e0b' : '#22c55e'
  const totalHours = (vol.assignments || []).reduce((sum, a) => sum + parseInt(a.duration || '0'), 0)
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'history', label: 'Assignment History' },
    { key: 'availability', label: 'Availability' },
    { key: 'whatsapp', label: 'WhatsApp Log' },
  ]

  return (
    <div className="dashboard-layout">
      <Sidebar/>
      <div className="dashboard-main">
        <TopBar title="Volunteer Profile"/>
        <div className="dashboard-content vol-profile-page">

          <Link to="/volunteers" className="vol-back-link"><ArrowLeft size={15}/> Back to Volunteers</Link>

          {/* Profile Header */}
          <div className="vol-profile-header">
            <div className="vol-profile-avatar" style={{background:`${statusColors[vol.status]}18`,color:statusColors[vol.status]}}>{vol.initials}</div>
            <div className="vol-profile-info">
              <h1 className="vol-profile-name">{vol.name}</h1>
              <div className="vol-profile-meta-row">
                <span className="vol-card-status" style={{background:`${statusColors[vol.status]}18`,color:statusColors[vol.status],borderColor:`${statusColors[vol.status]}30`}}>{vol.status}</span>
                <span className="vol-profile-meta"><Phone size={13}/> {vol.maskedPhone}</span>
                <span className="vol-profile-meta"><MapPin size={13}/> {vol.homeZone}</span>
                <span className="vol-profile-meta"><Clock size={13}/> Joined {vol.joined}</span>
                <span className="vol-profile-meta"><Shield size={13}/> {vol.completedAssignments} missions completed</span>
              </div>
              <div className="vol-profile-langs">
                {vol.languages.map(l => <span key={l} className="vol-lang-tag"><Globe size={11}/> {l}</span>)}
              </div>
            </div>
            <div className="vol-profile-score">
              <div className="vol-score-circle" style={{borderColor: vol.performance.score >= 75 ? '#22c55e' : vol.performance.score >= 50 ? '#f59e0b' : '#ef4444'}}>
                <span className="vol-score-num">{vol.performance.score}</span>
                <span className="vol-score-label">Score</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="vol-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`vol-tab ${tab === t.key ? 'vol-tab--active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="vol-tab-content">

            {tab === 'overview' && (
              <div className="vol-overview">
                <div className="vol-overview-grid">
                  {/* Skills */}
                  <div className="vol-overview-card">
                    <h3 className="vol-section-title">Skills & Proficiency</h3>
                    <div className="vol-skills-list">
                      {vol.skills.map(s => (
                        <div key={s.name} className="vol-skill-row">
                          <span className="vol-skill-name">{s.name}</span>
                          <span className={`vol-prof-badge vol-prof--${s.level.toLowerCase()}`}>{s.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="vol-overview-card">
                    <h3 className="vol-section-title">Performance Breakdown</h3>
                    {[
                      { label:'Response Rate', value:vol.performance.responseRate, color:'#3b82f6' },
                      { label:'Completion Rate', value:vol.performance.completionRate, color:'#22c55e' },
                      { label:'On-time Rate', value:vol.performance.onTimeRate, color:'#f59e0b' },
                      { label:'Feedback Score', value:vol.performance.feedbackScore, color:'#8b5cf6' },
                    ].map(p => (
                      <div key={p.label} className="vol-perf-row">
                        <span className="vol-perf-label">{p.label}</span>
                        <div className="vol-perf-bar"><div style={{width:`${p.value}%`,background:p.color}}/></div>
                        <span className="vol-perf-val">{p.value}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="vol-overview-card">
                    <h3 className="vol-section-title">Details</h3>
                    <div className="vol-detail-list">
                      <div className="vol-detail-item"><span>Home Zone</span><span>{vol.homeZone}</span></div>
                      <div className="vol-detail-item"><span>Coverage Radius</span><span>{vol.coverageRadius}</span></div>
                      <div className="vol-detail-item"><span>Available Days</span><span>{vol.availabilityDays.join(', ')}</span></div>
                      <div className="vol-detail-item"><span>Available Hours</span><span>{vol.availabilityHours}</span></div>
                      <div className="vol-detail-item"><span>Emergency Contact</span><span>{vol.emergencyContact}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'history' && (
              <div className="vol-history">
                <div className="vol-history-summary">
                  <span>Total Hours Contributed: <b>{totalHours}h</b></span>
                  <span>Total Assignments: <b>{vol.assignments.length}</b></span>
                </div>
                <div className="needs-table-wrap">
                  <table className="needs-table">
                    <thead><tr>
                      <th>Date</th><th>Need Title</th><th>Zone</th><th>Duration</th><th>Status</th><th>Rating</th>
                    </tr></thead>
                    <tbody>
                      {vol.assignments.map(a => (
                        <tr key={a.id}>
                          <td className="needs-cell-date">{a.date}</td>
                          <td className="needs-cell-title">{a.title}</td>
                          <td>{a.zone}</td>
                          <td>{a.duration}</td>
                          <td><span className={`needs-status-badge needs-status--${a.status.toLowerCase().replace(/ /g,'-')}`}>{a.status}</span></td>
                          <td>{'★'.repeat(a.rating)}{'☆'.repeat(5 - a.rating)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'availability' && (
              <div className="vol-availability">
                {/* Weekly calendar */}
                <div className="vol-overview-card">
                  <h3 className="vol-section-title">Weekly Schedule</h3>
                  <div className="vol-calendar-grid">
                    {daysList.map(d => (
                      <div key={d} className={`vol-calendar-day ${vol.availabilityDays.includes(d) ? 'vol-calendar-day--active' : ''}`}>
                        <span className="vol-cal-day-name">{d}</span>
                        <span className="vol-cal-day-hours">{vol.availabilityDays.includes(d) ? vol.availabilityHours : 'Off'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hours */}
                <div className="vol-overview-card">
                  <h3 className="vol-section-title">Current Week Hours</h3>
                  <div className="vol-hours-display">
                    <div className="vol-hours-big">
                      <span className="vol-hours-num" style={{color:hoursColor}}>{vol.hoursUsed}</span>
                      <span className="vol-hours-sep">/</span>
                      <span className="vol-hours-lim">{vol.weeklyLimit}h</span>
                    </div>
                    <div className="vol-hours-bigbar">
                      <div style={{width:`${Math.min(hoursPercent,100)}%`,background:hoursColor}}/>
                    </div>
                    {hoursPercent >= 100 && (
                      <div className="vol-fatigue-alert vol-fatigue--red"><AlertTriangle size={14}/> This volunteer has reached their weekly hour limit and is automatically in Rest Mode.</div>
                    )}
                    {hoursPercent >= 80 && hoursPercent < 100 && (
                      <div className="vol-fatigue-alert vol-fatigue--yellow"><AlertTriangle size={14}/> Approaching weekly limit ({hoursPercent}%). Consider limiting new assignments.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === 'whatsapp' && (
              <div className="vol-whatsapp">
                <div className="vol-wa-summary">
                  <MessageCircle size={16}/> Average Response Time: <b>{vol.avgResponseTime}</b>
                </div>
                <div className="vol-wa-timeline">
                  {vol.whatsappLog.map(msg => (
                    <div key={msg.id} className="vol-wa-item">
                      <div className="vol-wa-sent">
                        <div className="vol-wa-bubble vol-wa-bubble--sent">
                          <Send size={12}/> <span>{msg.messageSent}</span>
                        </div>
                        <span className="vol-wa-time">{msg.timestamp}</span>
                      </div>
                      {msg.reply && (
                        <div className="vol-wa-reply">
                          <div className="vol-wa-bubble vol-wa-bubble--reply">
                            <span>{msg.reply}</span>
                          </div>
                          <span className="vol-wa-time">Replied in {msg.replyTime}</span>
                        </div>
                      )}
                      {!msg.reply && <p className="vol-wa-no-reply">No reply received</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
