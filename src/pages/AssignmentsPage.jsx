import { useState, useCallback, useEffect } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import AssignmentDetailModal from '../components/assignments/AssignmentDetailModal'
import CreateAssignmentModal from '../components/assignments/CreateAssignmentModal'
import { useAuth } from '../context/AuthContext'
import { fetchAssignments } from '../services/dataService'
import { Plus, Bell, CheckCircle2, MapPin, Clock, AlertTriangle, MoreVertical, GripVertical, User, Send, RefreshCw, Loader2, Info } from 'lucide-react'
import '../styles/assignments.css'

const urgencyColor = u => u === 'CRITICAL' ? '#ef4444' : u === 'HIGH' ? '#f97316' : '#3b82f6'
const stageLabels = { notified:'Notified', accepted:'Accepted', onsite:'On Site', completed:'Completed' }
const stageIcons = { notified: Bell, accepted: CheckCircle2, onsite: MapPin, completed: CheckCircle2 }

export default function AssignmentsPage() {
  const { currentUser } = useAuth()
  const [board, setBoard] = useState({ notified:[], accepted:[], onsite:[], completed:[] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')
  const [detailCard, setDetailCard] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)
  const [dragCard, setDragCard] = useState(null)
  const [dragFrom, setDragFrom] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    setLoading(true)
    fetchAssignments(currentUser.uid).then(data => {
      const grouped = { notified:[], accepted:[], onsite:[], completed:[] }
      data.forEach(a => {
        if (grouped[a.stage]) grouped[a.stage].push(a)
      })
      setBoard(grouped)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [currentUser])

  const handleDragStart = (card, fromStage) => { setDragCard(card); setDragFrom(fromStage) }
  const handleDragOver = (e) => e.preventDefault()
  const handleDrop = (toStage) => {
    if (!dragCard || !dragFrom || dragFrom === toStage) { setDragCard(null); setDragFrom(null); return }
    setBoard(prev => {
      const newBoard = { ...prev }
      newBoard[dragFrom] = prev[dragFrom].filter(c => c.id !== dragCard.id)
      newBoard[toStage] = [{ ...dragCard, stage: toStage }, ...prev[toStage]]
      return newBoard
    })
    setDragCard(null); setDragFrom(null)
  }

  const handleAction = useCallback((action, card) => {
    setMenuOpen(null)
    if (action === 'view') setDetailCard(card)
    if (action === 'complete') {
      setBoard(prev => {
        const newBoard = { ...prev }
        Object.keys(newBoard).forEach(k => { newBoard[k] = prev[k].filter(c => c.id !== card.id) })
        newBoard.completed = [{ ...card, stage: 'completed', duration: '—' }, ...prev.completed]
        return newBoard
      })
    }
  }, [])

  const columns = ['notified', 'accepted', 'onsite', 'completed']
  const totalActive = columns.reduce((s, c) => s + board[c].length, 0)

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar title="Assignments" />
        <div className="dashboard-content assign-page">

          {/* Header */}
          <div className="needs-header">
            <h1 className="needs-page-title">Assignments</h1>
            <button className="needs-add-btn" onClick={() => setShowCreate(true)}><Plus size={16}/> Create Assignment</button>
          </div>

          {/* Tab filters */}
          <div className="assign-tabs">
            <button className={`assign-tab ${activeTab==='active'?'assign-tab--active':''}`} onClick={()=>setActiveTab('active')}>
              Active <span className="assign-tab-count">{totalActive}</span>
            </button>
            <button className={`assign-tab ${activeTab==='completed'?'assign-tab--active':''}`} onClick={()=>setActiveTab('completed')}>
              Completed <span className="assign-tab-count">{board.completed.length}</span>
            </button>
            <button className={`assign-tab ${activeTab==='escalated'?'assign-tab--active assign-tab--esc':''}`} onClick={()=>setActiveTab('escalated')}>
              Escalated <span className="assign-tab-count assign-tab-count--esc">0</span>
            </button>
          </div>

          {/* ACTIVE — Kanban Board */}
          {activeTab === 'active' && (
            <div className="kanban-board">
              {columns.map(stage => {
                const Icon = stageIcons[stage]
                const cards = board[stage]
                return (
                  <div key={stage} className="kanban-col" onDragOver={handleDragOver} onDrop={() => handleDrop(stage)}>
                    <div className="kanban-col-header">
                      <div className="kanban-col-title-row">
                        <Icon size={15} className={`kanban-stage-icon kanban-stage--${stage}`}/>
                        <span className="kanban-col-title">{stageLabels[stage]}</span>
                        <span className="kanban-col-count">{cards.length}</span>
                      </div>
                    </div>
                    <div className="kanban-col-body">
                      {cards.map(card => (
                        <div key={card.id} className={`kanban-card ${card.timedOut ? 'kanban-card--timeout' : ''}`}
                          draggable onDragStart={() => handleDragStart(card, stage)}
                          onClick={() => setDetailCard(card)}>
                          <div className="kanban-card-top">
                            <span className="kanban-card-urgency" style={{background:`${urgencyColor(card.urgency)}18`,color:urgencyColor(card.urgency),borderColor:`${urgencyColor(card.urgency)}40`}}>{card.urgency}</span>
                            <div className="kanban-card-menu-wrap">
                              <button className="kanban-card-menu" onClick={e=>{e.stopPropagation();setMenuOpen(menuOpen===card.id?null:card.id)}}>
                                <MoreVertical size={14}/>
                              </button>
                              {menuOpen === card.id && (
                                <div className="kanban-dropdown" onClick={e=>e.stopPropagation()}>
                                  <button onClick={()=>handleAction('view',card)}>View Details</button>
                                  <button onClick={()=>handleAction('reassign',card)}>Reassign</button>
                                  <button onClick={()=>handleAction('escalate',card)}>Escalate</button>
                                  <button onClick={()=>handleAction('complete',card)}>Mark Complete</button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="kanban-card-need">{card.need}</p>
                          <div className="kanban-card-vol">
                            <div className="kanban-card-vol-avatar">{card.volInitials}</div>
                            <span>{card.volunteer}</span>
                          </div>
                          <div className="kanban-card-footer">
                            <span className="kanban-card-zone"><MapPin size={11}/> {card.zone}</span>
                            <span className={`kanban-card-time ${card.timedOut?'kanban-card-time--warn':''}`}>
                              <Clock size={11}/> {card.timeLabel}
                              {card.timedOut && <AlertTriangle size={11}/>}
                            </span>
                          </div>
                          {stage === 'completed' && card.duration && (
                            <div className="kanban-card-duration"><CheckCircle2 size={12}/> Completed in {card.duration}</div>
                          )}
                          <div className="kanban-drag-handle"><GripVertical size={12}/></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* COMPLETED — same cards in list view */}
          {activeTab === 'completed' && (
            <div className="assign-completed-list">
              {board.completed.map(card => (
                <div key={card.id} className="assign-completed-row" onClick={() => setDetailCard(card)}>
                  <div className="kanban-card-vol-avatar">{card.volInitials}</div>
                  <div className="assign-completed-info">
                    <p className="assign-completed-need">{card.need}</p>
                    <p className="assign-completed-vol">{card.volunteer} · {card.zone}</p>
                  </div>
                  <span className="kanban-card-urgency" style={{background:`${urgencyColor(card.urgency)}18`,color:urgencyColor(card.urgency),borderColor:`${urgencyColor(card.urgency)}40`}}>{card.urgency}</span>
                  <span className="assign-completed-time">{card.duration || card.timeLabel}</span>
                  <CheckCircle2 size={16} style={{color:'#22c55e'}}/>
                </div>
              ))}
            </div>
          )}

          {/* ESCALATED */}
          {activeTab === 'escalated' && (
            <div className="needs-empty-state">
              <AlertTriangle size={48} style={{color:'rgba(255,255,255,0.3)', marginBottom:12}} />
              <h3>No escalated assignments</h3>
              <p>Assignments that require attention will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {detailCard && <AssignmentDetailModal card={detailCard} onClose={() => setDetailCard(null)}/>}
      {showCreate && <CreateAssignmentModal onClose={() => setShowCreate(false)}/>}
    </div>
  )
}
