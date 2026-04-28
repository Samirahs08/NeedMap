import { MapPin, LayoutDashboard, ClipboardList, Users, GitPullRequestArrow, BarChart3, Upload, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Needs Management', icon: ClipboardList, path: '/needs' },
  { label: 'Volunteer Management', icon: Users, path: '/volunteers' },
  { label: 'Assignments', icon: GitPullRequestArrow, path: '/assignments' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Smart Upload', icon: Upload, path: '/upload' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/" className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <MapPin size={20} />
        </div>
        <span className="sidebar-logo-text">NeedMap</span>
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Main Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {isActive && <div className="sidebar-active-indicator" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-footer">
        <div className="sidebar-help-card">
          <div className="sidebar-help-icon">?</div>
          <p className="sidebar-help-title">Need Help?</p>
          <p className="sidebar-help-text">Contact support or view docs</p>
          <button className="sidebar-help-btn" onClick={() => window.open('mailto:support@needmap.org')}>Get Help</button>
        </div>
      </div>
    </aside>
  )
}
