import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, User, Settings, LogOut, Search, AlertTriangle, CheckCircle2, UserPlus, X, Clock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const notifications = [
  { id: 1, type: 'critical', title: 'Medical emergency — Zone 7', desc: 'Urgency 92/100. No volunteer assigned yet.', time: '2 min ago', unread: true },
  { id: 2, type: 'volunteer', title: 'Sneha Gupta accepted assignment', desc: 'Medical aid delivery in Zone 3.', time: '8 min ago', unread: true },
  { id: 3, type: 'escalation', title: 'Volunteer requested HELP', desc: 'Arjun Mehta escalated assignment A-0012.', time: '15 min ago', unread: true },
  { id: 4, type: 'resolved', title: 'Food distribution completed', desc: 'Ward 2 need resolved by Fatima Khan.', time: '1 hour ago', unread: false },
  { id: 5, type: 'volunteer', title: 'New volunteer registered', desc: 'Deepak Joshi joined via WhatsApp.', time: '2 hours ago', unread: false },
]

const notifIcons = {
  critical: { icon: AlertTriangle, bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  volunteer: { icon: UserPlus, bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  escalation: { icon: AlertTriangle, bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  resolved: { icon: CheckCircle2, bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
}

export default function TopBar({ title = 'Dashboard' }) {
  const { currentUser, userData, signOut } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifList, setNotifList] = useState(notifications)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)

  const unreadCount = notifList.filter(n => n.unread).length
  const displayName = userData?.fullName || currentUser?.email?.split('@')[0] || 'Coordinator'
  const ngoName = userData?.ngoName || 'NeedMap'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const dismissNotif = (id) => {
    setNotifList(prev => prev.filter(n => n.id !== id))
  }

  return (
    <header className="topbar">
      {/* Left — search */}
      <div className="topbar-search">
        <Search size={16} className="topbar-search-icon" />
        <input type="text" placeholder="Search needs, volunteers, zones…" className="topbar-search-input" />
      </div>

      {/* Center — page title */}
      <h1 className="topbar-title">{title}</h1>

      {/* Right — actions */}
      <div className="topbar-actions">
        {/* Notification bell */}
        <div className="topbar-notif-wrap" ref={notifRef}>
          <button
            className="topbar-icon-btn"
            id="notification-bell"
            aria-label="Notifications"
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false) }}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="topbar-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="topbar-notif-panel">
              <div className="topbar-notif-header">
                <h3 className="topbar-notif-title">Notifications</h3>
                {unreadCount > 0 && (
                  <button className="topbar-notif-mark" onClick={markAllRead}>Mark all read</button>
                )}
              </div>

              <div className="topbar-notif-list">
                {notifList.length === 0 && (
                  <p className="topbar-notif-empty">No notifications</p>
                )}
                {notifList.map(n => {
                  const cfg = notifIcons[n.type] || notifIcons.resolved
                  const Icon = cfg.icon
                  return (
                    <div key={n.id} className={`topbar-notif-item ${n.unread ? 'topbar-notif-item--unread' : ''}`}>
                      <div className="topbar-notif-icon" style={{ background: cfg.bg, color: cfg.color }}>
                        <Icon size={14} />
                      </div>
                      <div className="topbar-notif-content">
                        <p className="topbar-notif-item-title">{n.title}</p>
                        <p className="topbar-notif-item-desc">{n.desc}</p>
                        <span className="topbar-notif-item-time"><Clock size={10} /> {n.time}</span>
                      </div>
                      <button className="topbar-notif-dismiss" onClick={(e) => { e.stopPropagation(); dismissNotif(n.id) }}>
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>

              <Link to="/reports" className="topbar-notif-footer" onClick={() => setNotifOpen(false)}>
                View All Activity
              </Link>
            </div>
          )}
        </div>

        {/* NGO name */}
        <span className="topbar-ngo-name">{ngoName}</span>

        {/* Coordinator avatar + dropdown */}
        <div className="topbar-profile" ref={dropdownRef}>
          <button
            className="topbar-avatar-btn"
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false) }}
            id="coordinator-dropdown"
          >
            <div className="topbar-avatar">{initials}</div>
            <span className="topbar-coordinator-name">{displayName}</span>
            <ChevronDown size={14} className={`topbar-chevron ${dropdownOpen ? 'topbar-chevron--open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="topbar-dropdown">
              <Link to="/settings" className="topbar-dropdown-item">
                <User size={15} />
                <span>Profile &amp; Settings</span>
              </Link>
              <Link to="/settings" className="topbar-dropdown-item">
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <div className="topbar-dropdown-divider" />
              <button onClick={handleLogout} className="topbar-dropdown-item topbar-dropdown-item--danger" style={{background:'none',border:'none',width:'100%',cursor:'pointer'}}>
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
