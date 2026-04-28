import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import AddVolunteerModal from '../components/volunteers/AddVolunteerModal'
import { useAuth } from '../context/AuthContext'
import { fetchVolunteers, addVolunteer, zonesList } from '../services/dataService'
import { Plus, Search, Users, UserCheck, Moon, MapPin, Clock, Award, Loader2, Info } from 'lucide-react'
import '../styles/volunteers.css'

const skillsList = ['Medical','First Aid','Counseling','Transport','Logistics','Food Distribution','Construction','Shelter','Water & Sanitation','Education','Child Care','Elder Care','Translation','Communication','Security']
const statusColors = { Available:'#22c55e', Assigned:'#f59e0b', 'Rest Mode':'#64748b' }

export default function VolunteerManagementPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSkill, setFilterSkill] = useState('')
  const [filterZone, setFilterZone] = useState('')
  const [sortBy, setSortBy] = useState('matchScore')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    setLoading(true)
    fetchVolunteers(currentUser.uid).then(data => {
      setVolunteers(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [currentUser])

  const filtered = useMemo(() => {
    let list = [...volunteers]
    if (search) { const q = search.toLowerCase(); list = list.filter(v => v.name.toLowerCase().includes(q) || (v.phone && v.phone.includes(q))) }
    if (filterStatus) list = list.filter(v => v.status === filterStatus)
    if (filterSkill) list = list.filter(v => v.skills.some(s => s.name === filterSkill))
    if (filterZone) list = list.filter(v => v.homeZone === filterZone)
    list.sort((a, b) => {
      if (sortBy === 'matchScore') return (b.matchScore || 0) - (a.matchScore || 0)
      if (sortBy === 'hoursUsed') return (b.hoursUsed || 0) - (a.hoursUsed || 0)
      if (sortBy === 'completedAssignments') return (b.completedAssignments || 0) - (a.completedAssignments || 0)
      return 0
    })
    return list
  }, [volunteers, search, filterStatus, filterSkill, filterZone, sortBy])

  const stats = useMemo(() => ({
    total: volunteers.length,
    available: volunteers.filter(v => v.status === 'Available').length,
    restMode: volunteers.filter(v => v.status === 'Rest Mode').length,
  }), [volunteers])

  const handleAdd = useCallback(async (form) => {
    if (!currentUser) return
    const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const volData = {
      name: form.name, initials, phone: form.phone,
      skills: form.skills.map(s => ({ name: s, level: 'Basic' })),
      homeZone: form.homeZone, languages: form.languages,
      status: 'Available', weeklyLimit: Number(form.weeklyLimit), hoursUsed: 0,
      totalAssignments: 0, completedAssignments: 0, completionRate: 0,
      joined: new Date().toISOString().split('T')[0],
      availabilityDays: form.availDays,
      availabilityHours: `${form.availHoursFrom} — ${form.availHoursTo}`,
      coverageRadius: '5 km', distance: '—',
      performance: { score: 0, responseRate: 0, completionRate: 0, onTimeRate: 0, feedbackScore: 0 },
      matchScore: 50, assignments: [], whatsappLog: [], avgResponseTime: '—',
    }
    const created = await addVolunteer(currentUser.uid, volData)
    setVolunteers(prev => [{ ...volData, ...created }, ...prev])
    setShowAddModal(false)
  }, [currentUser])

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar title="Volunteer Management" />
        <div className="dashboard-content vol-page">

          {/* Header */}
          <div className="needs-header">
            <h1 className="needs-page-title">Volunteers</h1>
            <button className="needs-add-btn" onClick={() => setShowAddModal(true)}><Plus size={16}/> Add Volunteer</button>
          </div>

          {/* Summary Cards */}
          <div className="vol-summary-row">
            <div className="vol-summary-card">
              <div className="vol-summary-icon vol-summary-icon--total"><Users size={20}/></div>
              <div><p className="vol-summary-val">{stats.total}</p><p className="vol-summary-label">Total Registered</p></div>
            </div>
            <div className="vol-summary-card">
              <div className="vol-summary-icon vol-summary-icon--available"><UserCheck size={20}/></div>
              <div><p className="vol-summary-val">{stats.available}</p><p className="vol-summary-label">Currently Available</p></div>
            </div>
            <div className="vol-summary-card">
              <div className="vol-summary-icon vol-summary-icon--rest"><Moon size={20}/></div>
              <div><p className="vol-summary-val">{stats.restMode}</p><p className="vol-summary-label">On Rest Mode</p></div>
            </div>
          </div>

          {/* Filters */}
          <div className="needs-filters">
            <div className="needs-search-wrap">
              <Search size={15} className="needs-search-icon"/>
              <input type="text" placeholder="Search by name or phone…" className="needs-search-input" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="needs-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Available">Available</option><option value="Assigned">Assigned</option><option value="Rest Mode">Rest Mode</option>
            </select>
            <select className="needs-filter-select" value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
              <option value="">All Skills</option>
              {skillsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="needs-filter-select" value={filterZone} onChange={e => setFilterZone(e.target.value)}>
              <option value="">All Zones</option>
              {zonesList.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
            <select className="needs-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="matchScore">Sort: Match Score</option>
              <option value="hoursUsed">Sort: Hours This Week</option>
              <option value="completedAssignments">Sort: Assignments</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="needs-loading-state">
              <Loader2 size={32} className="needs-spinner" />
              <p>Loading volunteers…</p>
            </div>
          )}

          {/* Empty */}
          {!loading && volunteers.length === 0 && (
            <div className="needs-empty-state">
              <Info size={48} style={{color:'rgba(255,255,255,0.3)', marginBottom:12}} />
              <h3>No volunteers registered</h3>
              <p>Add your first volunteer using the button above.</p>
            </div>
          )}

          {/* Volunteer Grid */}
          {!loading && volunteers.length > 0 && (
            <>
              <p className="needs-results-count">Showing {filtered.length} of {volunteers.length} volunteers</p>
              <div className="vol-grid">
                {filtered.map(vol => {
                  const hoursPercent = vol.weeklyLimit ? Math.round((vol.hoursUsed / vol.weeklyLimit) * 100) : 0
                  const hoursColor = hoursPercent >= 100 ? '#ef4444' : hoursPercent >= 80 ? '#f59e0b' : '#22c55e'
                  return (
                    <div key={vol.id} className="vol-card">
                      <div className="vol-card-top">
                        <div className="vol-card-avatar" style={{ background: `${statusColors[vol.status]}18`, color: statusColors[vol.status] }}>{vol.initials}</div>
                        <div className="vol-card-info">
                          <p className="vol-card-name">
                            {vol.name}
                            {vol.isDemo && <span className="needs-demo-badge" style={{marginLeft:8}}>Demo</span>}
                          </p>
                          <span className="vol-card-status" style={{ background: `${statusColors[vol.status]}18`, color: statusColors[vol.status], borderColor: `${statusColors[vol.status]}30` }}>{vol.status}</span>
                        </div>
                        <span className="vol-card-match">{vol.matchScore || 0}%</span>
                      </div>

                      <div className="vol-card-skills">
                        {vol.skills.slice(0, 3).map(s => <span key={s.name} className="volunteer-skill-tag">{s.name}</span>)}
                        {vol.skills.length > 3 && <span className="vol-card-more">+{vol.skills.length - 3} more</span>}
                      </div>

                      <div className="vol-card-meta">
                        <span><MapPin size={12}/> {vol.homeZone}</span>
                        <span><Clock size={12}/> {vol.distance || '—'}</span>
                      </div>

                      <div className="vol-card-hours">
                        <div className="vol-card-hours-header">
                          <span>Weekly Hours</span>
                          <span style={{ color: hoursColor }}>{vol.hoursUsed}/{vol.weeklyLimit}h</span>
                        </div>
                        <div className="vol-card-hours-bar">
                          <div style={{ width: `${Math.min(hoursPercent, 100)}%`, background: hoursColor }} />
                        </div>
                      </div>

                      <div className="vol-card-stats">
                        <div><Award size={13}/> <b>{vol.totalAssignments}</b> missions</div>
                        <div>{vol.completionRate}% completion</div>
                      </div>

                      <div className="vol-card-actions">
                        <button className="vol-card-btn vol-card-btn--profile" onClick={() => navigate(`/volunteers/${vol.id}`)}>View Profile</button>
                        <button className="vol-card-btn vol-card-btn--assign" onClick={() => alert('Assignment flow for this volunteer will open here.')}>Assign Now</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
      {showAddModal && <AddVolunteerModal onClose={() => setShowAddModal(false)} onSubmit={handleAdd}/>}
    </div>
  )
}
