import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import AlertBanner from '../components/dashboard/AlertBanner'
import MetricsRow from '../components/dashboard/MetricsRow'
import UrgencyMap from '../components/dashboard/UrgencyMap'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import TopUrgentNeeds from '../components/dashboard/TopUrgentNeeds'
import VolunteerStatusBoard from '../components/dashboard/VolunteerStatusBoard'
import AssignModal from '../components/dashboard/AssignModal'
import {
  metricsData,
  alertBanner,
  mapNeeds,
  activityFeed,
  topUrgentNeeds,
  volunteers,
  bestMatchedVolunteers,
} from '../data/dashboardData'
import '../styles/dashboard.css'

export default function DashboardPage() {
  const [assignNeed, setAssignNeed] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(Date.now())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Simulate critical need notification on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const timer = setTimeout(() => {
        new Notification('NeedMap — Critical Need', {
          body: 'Medical emergency reported in Zone 7. Urgency: 92/100',
          icon: '/favicon.svg',
        })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAssignClick = useCallback((need) => {
    setAssignNeed(need)
  }, [])

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <AlertBanner message={alertBanner.show ? alertBanner.message : null} />

        <div className="dashboard-content">
          <MetricsRow data={metricsData} />

          <div className="dashboard-columns">
            {/* Left column — 60% */}
            <div className="dashboard-col-left">
              <UrgencyMap needs={mapNeeds} onAssignClick={handleAssignClick} />
              <ActivityFeed items={activityFeed} />
            </div>

            {/* Right column — 40% */}
            <div className="dashboard-col-right">
              <TopUrgentNeeds needs={topUrgentNeeds} onAssignClick={handleAssignClick} />
              <VolunteerStatusBoard data={volunteers} onAssignClick={handleAssignClick} />
            </div>
          </div>
        </div>

        {/* Refresh indicator */}
        <div className="dashboard-refresh-indicator">
          Auto-refresh: {new Date(lastRefresh).toLocaleTimeString()}
        </div>
      </div>

      {/* Assign modal */}
      {assignNeed && (
        <AssignModal
          need={assignNeed}
          volunteers={bestMatchedVolunteers}
          onClose={() => setAssignNeed(null)}
        />
      )}
    </div>
  )
}
