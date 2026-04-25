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
import { useAuth } from '../context/AuthContext'
import {
  fetchNeeds, fetchVolunteers, fetchAssignments, seedDemoDataIfEmpty,
  computeMetrics, buildMapNeeds, buildActivityFeed, buildTopUrgentNeeds, buildVolunteerBoard,
  computeImpactMetrics,
} from '../services/dataService'
import { Loader2, TrendingUp, Users, CheckCircle2, Heart } from 'lucide-react'
import '../styles/dashboard.css'

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const [assignNeed, setAssignNeed] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [loading, setLoading] = useState(true)

  // Live data state
  const [metricsData, setMetricsData] = useState(null)
  const [mapNeeds, setMapNeeds] = useState([])
  const [activityFeedData, setActivityFeedData] = useState([])
  const [topUrgent, setTopUrgent] = useState([])
  const [volunteerBoard, setVolunteerBoard] = useState({ available: [], assigned: [], rest: [] })
  const [bestMatched, setBestMatched] = useState([])
  const [impact, setImpact] = useState(null)

  // Load all data from Firestore
  const loadData = useCallback(async () => {
    if (!currentUser) return
    try {
      // Seed demo data on first login
      await seedDemoDataIfEmpty(currentUser.uid)

      const [needs, volunteers, assignments] = await Promise.all([
        fetchNeeds(currentUser.uid),
        fetchVolunteers(currentUser.uid),
        fetchAssignments(currentUser.uid),
      ])

      setMetricsData(computeMetrics(needs, volunteers, assignments))
      setMapNeeds(buildMapNeeds(needs))
      setActivityFeedData(buildActivityFeed(needs, volunteers))
      setTopUrgent(buildTopUrgentNeeds(needs))
      setVolunteerBoard(buildVolunteerBoard(volunteers))
      setBestMatched(volunteers.filter(v => v.status === 'Available').map(v => ({
        id: v.id, name: v.name, initials: v.initials,
        matchPercent: v.matchScore || 80,
        distance: v.distance || '2.0 km',
        skills: v.skills.map(s => s.name).slice(0, 2),
        availability: 'Available now',
      })))
      setImpact(computeImpactMetrics(needs, volunteers, assignments))
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => { loadData() }, [loadData])

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

  const handleAssignClick = useCallback((need) => {
    setAssignNeed(need)
  }, [])

  const alertMessage = metricsData && metricsData.criticalNeeds > 0
    ? `⚠ ${metricsData.criticalNeeds} critical need${metricsData.criticalNeeds > 1 ? 's' : ''} require immediate attention. Consider pre-assigning volunteers.`
    : null

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <TopBar />
          <div className="dashboard-content" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
            <div style={{textAlign:'center',color:'rgba(255,255,255,0.5)'}}>
              <Loader2 size={40} className="needs-spinner" style={{margin:'0 auto 16px'}} />
              <p style={{fontSize:14}}>Loading dashboard data…</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <AlertBanner message={alertMessage} />

        <div className="dashboard-content">
          {metricsData && <MetricsRow data={metricsData} />}

          {/* Impact Metrics Bar */}
          {impact && (
            <div className="impact-metrics-bar">
              <div className="impact-metric">
                <TrendingUp size={16} style={{color:'#22c55e'}} />
                <span><b>{impact.totalNeedsLogged}</b> Needs Logged</span>
              </div>
              <div className="impact-metric">
                <CheckCircle2 size={16} style={{color:'#3b82f6'}} />
                <span><b>{impact.needsResolved}</b> Resolved ({impact.resolutionRate}%)</span>
              </div>
              <div className="impact-metric">
                <Users size={16} style={{color:'#f59e0b'}} />
                <span><b>{impact.activeVolunteers}</b> Active Volunteers</span>
              </div>
              <div className="impact-metric">
                <Heart size={16} style={{color:'#ec4899'}} />
                <span><b>{impact.peopleHelped}</b> People Helped</span>
              </div>
            </div>
          )}

          <div className="dashboard-columns">
            {/* Left column — 60% */}
            <div className="dashboard-col-left">
              <UrgencyMap needs={mapNeeds} onAssignClick={handleAssignClick} />
              <ActivityFeed items={activityFeedData} />
            </div>

            {/* Right column — 40% */}
            <div className="dashboard-col-right">
              <TopUrgentNeeds needs={topUrgent} onAssignClick={handleAssignClick} />
              <VolunteerStatusBoard data={volunteerBoard} onAssignClick={handleAssignClick} />
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
          volunteers={bestMatched}
          onClose={() => setAssignNeed(null)}
        />
      )}
    </div>
  )
}
