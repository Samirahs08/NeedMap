import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, User, Settings, LogOut, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopBar({ title = 'Dashboard' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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
        <button className="topbar-icon-btn" id="notification-bell" aria-label="Notifications">
          <Bell size={18} />
          <span className="topbar-badge">3</span>
        </button>

        {/* NGO name */}
        <span className="topbar-ngo-name">Hope Foundation</span>

        {/* Coordinator avatar + dropdown */}
        <div className="topbar-profile" ref={dropdownRef}>
          <button
            className="topbar-avatar-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            id="coordinator-dropdown"
          >
            <div className="topbar-avatar">SK</div>
            <span className="topbar-coordinator-name">Samira K.</span>
            <ChevronDown size={14} className={`topbar-chevron ${dropdownOpen ? 'topbar-chevron--open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="topbar-dropdown">
              <Link to="/profile" className="topbar-dropdown-item">
                <User size={15} />
                <span>Profile</span>
              </Link>
              <Link to="/settings" className="topbar-dropdown-item">
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <div className="topbar-dropdown-divider" />
              <Link to="/login" className="topbar-dropdown-item topbar-dropdown-item--danger">
                <LogOut size={15} />
                <span>Logout</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
