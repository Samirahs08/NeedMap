import { useState, useMemo, useCallback, useEffect } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import NeedDetailDrawer from '../components/needs/NeedDetailDrawer'
import AddNeedModal from '../components/needs/AddNeedModal'
import CreateAssignmentModal from '../components/assignments/CreateAssignmentModal'
import { useAuth } from '../context/AuthContext'
import { fetchNeeds, addNeed, updateNeedStatus, categoriesList, zonesList, statusesList } from '../services/dataService'
import { Plus, Search, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, UserPlus, CheckCircle2, AlertCircle, Clock, Loader2, Archive, Info } from 'lucide-react'
import '../styles/needs.css'

const ROWS_PER_PAGE = 20

const urgencyColor = (u) => u > 80 ? '#ef4444' : u > 50 ? '#f97316' : '#22c55e'
const statusClass = (s) => `needs-status-badge needs-status--${s.toLowerCase().replace(/ /g, '-')}`
const catColors = { Medical:'#ef4444', Food:'#f59e0b', 'Flood Relief':'#3b82f6', Sanitation:'#8b5cf6', Education:'#06b6d4', 'Elder Care':'#ec4899', 'Child Care':'#f97316', Shelter:'#22c55e' }

export default function NeedsManagementPage() {
  const { currentUser } = useAuth()
  const [needs, setNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterZone, setFilterZone] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterUrgency, setFilterUrgency] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [sortCol, setSortCol] = useState('urgency')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(new Set())
  const [drawerNeed, setDrawerNeed] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [assignNeed, setAssignNeed] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    setLoading(true)
    fetchNeeds(currentUser.uid).then(data => {
      setNeeds(data.sort((a, b) => b.urgency - a.urgency))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [currentUser])

  const filtered = useMemo(() => {
    let list = [...needs]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.zone.toLowerCase().includes(q) || n.category.toLowerCase().includes(q))
    }
    if (filterZone) list = list.filter(n => n.zone === filterZone)
    if (filterCategory) list = list.filter(n => n.category === filterCategory)
    if (filterUrgency) {
      if (filterUrgency === 'Critical') list = list.filter(n => n.urgency > 80)
      else if (filterUrgency === 'High') list = list.filter(n => n.urgency > 50 && n.urgency <= 80)
      else if (filterUrgency === 'Medium') list = list.filter(n => n.urgency > 25 && n.urgency <= 50)
      else list = list.filter(n => n.urgency <= 25)
    }
    if (filterStatus) list = list.filter(n => n.status === filterStatus)
    if (filterDateFrom) list = list.filter(n => n.dateLogged >= filterDateFrom)
    if (filterDateTo) list = list.filter(n => n.dateLogged <= filterDateTo)

    list.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol]
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase() }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [needs, search, filterZone, filterCategory, filterUrgency, filterStatus, filterDateFrom, filterDateTo, sortCol, sortDir])

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE)
  const pageData = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const clearFilters = () => { setSearch(''); setFilterZone(''); setFilterCategory(''); setFilterUrgency(''); setFilterStatus(''); setFilterDateFrom(''); setFilterDateTo(''); setPage(1) }
  const handleSort = (col) => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('desc') } }
  const SortIcon = ({ col }) => sortCol === col ? (sortDir === 'asc' ? <ChevronUp size={13}/> : <ChevronDown size={13}/>) : <ChevronDown size={13} style={{opacity:0.25}}/>
  const toggleSelect = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  const toggleAll = () => { if (selected.size === pageData.length) setSelected(new Set()); else setSelected(new Set(pageData.map(n => n.id))) }

  const handleAddNeed = useCallback(async (newNeed) => {
    if (!currentUser) return
    try {
      const created = await addNeed(currentUser.uid, newNeed)
      setNeeds(prev => [{ ...newNeed, ...created, dateLogged: new Date().toISOString().split('T')[0], reports: 1, volunteersAssigned: 0, volunteersNeeded: newNeed.volunteersNeeded || 2, fieldReports: [], activityLog: [{ text: 'Logged manually by coordinator', time: 'Just now' }], severity: newNeed.severity, frequency: 1, recency: 5, coverage: 1 }, ...prev])
      setShowAddModal(false)
    } catch (err) {
      console.error("Failed to add need:", err)
      alert("Error saving to database. You might have hit your Firebase usage quota, or your internet is unstable. Check the browser console.")
    }
  }, [currentUser])

  const handleResolve = useCallback(async (id) => {
    if (!currentUser) return
    await updateNeedStatus(currentUser.uid, id, 'Resolved')
    setNeeds(prev => prev.map(n => n.id === id ? { ...n, status: 'Resolved' } : n))
    setDrawerNeed(null)
  }, [currentUser])

  const handleEscalate = useCallback(async (id) => {
    if (!currentUser) return
    await updateNeedStatus(currentUser.uid, id, 'Escalated')
    setNeeds(prev => prev.map(n => n.id === id ? { ...n, status: 'Escalated' } : n))
    setDrawerNeed(null)
  }, [currentUser])

  const bulkResolve = async () => {
    if (!currentUser) return
    for (const id of selected) {
      await updateNeedStatus(currentUser.uid, id, 'Resolved')
    }
    setNeeds(prev => prev.map(n => selected.has(n.id) ? { ...n, status: 'Resolved' } : n))
    setSelected(new Set())
  }

  const stats = useMemo(() => ({
    total: needs.length,
    critical: needs.filter(n => n.urgency > 80).length,
    inProgress: needs.filter(n => n.status === 'In Progress').length,
    resolved: needs.filter(n => n.status === 'Resolved').length,
  }), [needs])

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar title="Needs Management" />

        <div className="dashboard-content needs-page">
          {/* Page Header */}
          <div className="needs-header">
            <div>
              <h1 className="needs-page-title">Community Needs</h1>
              <div className="needs-summary-pills">
                <span className="needs-pill"><Archive size={13}/> Total <b>{stats.total}</b></span>
                <span className="needs-pill needs-pill--critical"><AlertCircle size={13}/> Critical <b>{stats.critical}</b></span>
                <span className="needs-pill needs-pill--progress"><Loader2 size={13}/> In Progress <b>{stats.inProgress}</b></span>
                <span className="needs-pill needs-pill--resolved"><CheckCircle2 size={13}/> Resolved <b>{stats.resolved}</b></span>
              </div>
            </div>
            <button className="needs-add-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={16}/> Add Need Manually
            </button>
          </div>

          {/* Filter Bar */}
          <div className="needs-filters">
            <div className="needs-search-wrap">
              <Search size={15} className="needs-search-icon"/>
              <input type="text" placeholder="Search by location, need type, or keyword…" className="needs-search-input" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}/>
            </div>
            <select className="needs-filter-select" value={filterZone} onChange={e => { setFilterZone(e.target.value); setPage(1) }}>
              <option value="">All Zones</option>
              {zonesList.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
            <select className="needs-filter-select" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1) }}>
              <option value="">All Categories</option>
              {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="needs-filter-select" value={filterUrgency} onChange={e => { setFilterUrgency(e.target.value); setPage(1) }}>
              <option value="">All Urgencies</option>
              <option value="Critical">Critical (&gt;80)</option>
              <option value="High">High (50–80)</option>
              <option value="Medium">Medium (25–50)</option>
              <option value="Low">Low (&lt;25)</option>
            </select>
            <select className="needs-filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
              <option value="">All Statuses</option>
              {statusesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" className="needs-filter-date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setPage(1) }} title="From date"/>
            <input type="date" className="needs-filter-date" value={filterDateTo} onChange={e => { setFilterDateTo(e.target.value); setPage(1) }} title="To date"/>
            <button className="needs-clear-btn" onClick={clearFilters}><X size={13}/> Clear</button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="needs-loading-state">
              <Loader2 size={32} className="needs-spinner" />
              <p>Loading community needs…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && needs.length === 0 && (
            <div className="needs-empty-state">
              <Info size={48} style={{color:'rgba(255,255,255,0.3)', marginBottom:12}} />
              <h3>No data available</h3>
              <p>Start by logging a community need using the button above.</p>
            </div>
          )}

          {/* Data loaded */}
          {!loading && needs.length > 0 && (
            <>
              <p className="needs-results-count">Showing {Math.min(filtered.length, ROWS_PER_PAGE)} of {filtered.length} needs</p>

              {/* Bulk Actions */}
              {selected.size > 0 && (
                <div className="needs-bulk-bar">
                  <span>{selected.size} selected</span>
                  <button className="needs-bulk-btn" onClick={bulkResolve}><CheckCircle2 size={14}/> Mark as Resolved</button>
                  <button className="needs-bulk-btn" onClick={() => alert('Exporting selected needs to CSV...')}><Archive size={14}/> Export Selected</button>
                  <button className="needs-bulk-btn" onClick={() => alert('Bulk assignment flow coming soon.')}><UserPlus size={14}/> Assign to Volunteer</button>
                </div>
              )}

              {/* Table */}
              <div className="needs-table-wrap">
                <table className="needs-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" checked={selected.size === pageData.length && pageData.length > 0} onChange={toggleAll}/></th>
                      <th onClick={() => handleSort('id')}>ID <SortIcon col="id"/></th>
                      <th onClick={() => handleSort('title')}>Need Title <SortIcon col="title"/></th>
                      <th onClick={() => handleSort('category')}>Category <SortIcon col="category"/></th>
                      <th onClick={() => handleSort('zone')}>Zone <SortIcon col="zone"/></th>
                      <th onClick={() => handleSort('urgency')}>Urgency <SortIcon col="urgency"/></th>
                      <th onClick={() => handleSort('reports')}>Reports <SortIcon col="reports"/></th>
                      <th>Volunteers</th>
                      <th onClick={() => handleSort('status')}>Status <SortIcon col="status"/></th>
                      <th onClick={() => handleSort('dateLogged')}>Date <SortIcon col="dateLogged"/></th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map(n => (
                      <tr key={n.id} className={selected.has(n.id) ? 'needs-row--selected' : ''} onClick={() => setDrawerNeed(n)}>
                        <td onClick={e => e.stopPropagation()}><input type="checkbox" checked={selected.has(n.id)} onChange={() => toggleSelect(n.id)}/></td>
                        <td className="needs-cell-id">
                          #{typeof n.id === 'string' ? n.id.slice(0, 6) : n.id}
                          {n.isDemo && <span className="needs-demo-badge">Demo</span>}
                        </td>
                        <td className="needs-cell-title">{n.title}</td>
                        <td><span className="needs-cat-badge" style={{background:`${catColors[n.category] || '#64748b'}18`, color:catColors[n.category] || '#64748b', borderColor:`${catColors[n.category] || '#64748b'}30`}}>{n.category}</span></td>
                        <td className="needs-cell-zone">{n.zone}</td>
                        <td>
                          <div className="needs-urgency-cell">
                            <span style={{color:urgencyColor(n.urgency), fontWeight:700}}>{n.urgency}</span>
                            <div className="needs-urgency-minibar"><div style={{width:`${n.urgency}%`, background:urgencyColor(n.urgency)}}/></div>
                          </div>
                        </td>
                        <td className="needs-cell-center">{n.reports}</td>
                        <td className="needs-cell-center">{n.volunteersAssigned}/{n.volunteersNeeded}</td>
                        <td><span className={statusClass(n.status)}>{n.status}</span></td>
                        <td className="needs-cell-date">{n.dateLogged}</td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="needs-actions">
                            <button className="needs-action-btn" title="View" onClick={() => setDrawerNeed(n)}><Eye size={14}/></button>
                            <button className="needs-action-btn" title="Assign" onClick={() => setAssignNeed(n)}><UserPlus size={14}/></button>
                            <button className="needs-action-btn needs-action-btn--resolve" title="Resolve" onClick={() => handleResolve(n.id)}><CheckCircle2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="needs-pagination">
                <button className="needs-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={15}/></button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p
                  if (totalPages <= 7) p = i + 1
                  else if (page <= 4) p = i + 1
                  else if (page >= totalPages - 3) p = totalPages - 6 + i
                  else p = page - 3 + i
                  return <button key={p} className={`needs-page-btn ${p === page ? 'needs-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                })}
                <button className="needs-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={15}/></button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Side Drawer */}
      {drawerNeed && <NeedDetailDrawer need={drawerNeed} onClose={() => setDrawerNeed(null)} onResolve={handleResolve} onEscalate={handleEscalate}/>}

      {/* Add Modal */}
      {showAddModal && <AddNeedModal onClose={() => setShowAddModal(false)} onSubmit={handleAddNeed}/>}

      {/* Assign Modal */}
      {assignNeed && <CreateAssignmentModal onClose={() => setAssignNeed(null)} defaultNeed={assignNeed}/>}
    </div>
  )
}
