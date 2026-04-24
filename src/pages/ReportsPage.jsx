import { useState, useMemo } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import { getReportData } from '../data/reportsData'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts'
import { Download, Mail, FileText, Copy, Send, Clock, Check, Calendar, TrendingUp, Users, MapPin, Activity, Edit3, X } from 'lucide-react'
import '../styles/reports.css'

const rangeLabels = { week:'This Week', month:'This Month', '3months':'Last 3 Months', custom:'Custom Range' }
const CustomTooltipStyle = { background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'8px 12px', fontSize:'0.75rem', color:'#e2e8f0' }

export default function ReportsPage() {
  const [range, setRange] = useState('month')
  const [copied, setCopied] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [emailAddr, setEmailAddr] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [editDonor, setEditDonor] = useState(false)

  const data = useMemo(() => getReportData(range), [range])
  const [donorText, setDonorText] = useState('')
  const displayDonorText = editDonor ? donorText : data.donorText(data.summary)

  const handleCopy = () => { navigator.clipboard?.writeText(displayDonorText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleSendEmail = () => { setEmailSent(true); setTimeout(() => { setEmailSent(false); setShowEmail(false); setEmailAddr('') }, 2200) }

  const s = data.summary

  return (
    <div className="dashboard-layout">
      <Sidebar/>
      <div className="dashboard-main">
        <TopBar title="Reports"/>
        <div className="dashboard-content reports-page">

          {/* Header */}
          <div className="reports-header">
            <h1 className="needs-page-title">Reports & Analytics</h1>
            <div className="reports-header-actions">
              <button className="reports-btn"><Download size={14}/> Download PDF</button>
              <button className="reports-btn reports-btn--accent" onClick={() => setShowEmail(true)}><Mail size={14}/> Send to Donor</button>
            </div>
          </div>

          {/* Range Selector */}
          <div className="reports-range-row">
            {Object.entries(rangeLabels).map(([k,v]) => (
              <button key={k} className={`reports-range-btn ${range===k?'reports-range-btn--active':''}`} onClick={()=>setRange(k)}>{v}</button>
            ))}
          </div>

          {/* Summary Metrics */}
          <div className="reports-metrics">
            {[
              { label:'Total Needs', val:s.totalNeeds, icon:FileText, color:'#3b82f6' },
              { label:'Resolved', val:s.resolved, icon:Check, color:'#22c55e' },
              { label:'Resolution Rate', val:`${s.resolutionRate}%`, icon:TrendingUp, color:'#8b5cf6' },
              { label:'Volunteer Hours', val:`${s.totalHours}h`, icon:Users, color:'#f59e0b' },
              { label:'Avg Response', val:`${s.avgResponse}m`, icon:Clock, color:'#06b6d4' },
              { label:'Zones Covered', val:s.zonesCovered, icon:MapPin, color:'#ec4899' },
            ].map(m => (
              <div key={m.label} className="reports-metric-card">
                <div className="reports-metric-icon" style={{background:`${m.color}12`,color:m.color}}><m.icon size={18}/></div>
                <p className="reports-metric-val">{m.val}</p>
                <p className="reports-metric-label">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="reports-charts-row">
            {/* Donut Chart */}
            <div className="reports-chart-card">
              <h3 className="reports-chart-title">Needs by Category</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} stroke="none">
                    {data.categoryBreakdown.map((e,i) => <Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={CustomTooltipStyle}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="reports-legend">
                {data.categoryBreakdown.map(c => <span key={c.name} className="reports-legend-item"><span className="reports-legend-dot" style={{background:c.color}}/>{c.name} ({c.value})</span>)}
              </div>
            </div>

            {/* Line Chart */}
            <div className="reports-chart-card reports-chart-card--wide">
              <h3 className="reports-chart-title">Daily Needs Volume</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.dailyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="date" tick={{fill:'#64748b',fontSize:10}} interval={Math.max(1,Math.floor(data.dailyVolume.length/10))}/>
                  <YAxis tick={{fill:'#64748b',fontSize:10}}/>
                  <Tooltip contentStyle={CustomTooltipStyle}/>
                  <Legend iconType="circle" wrapperStyle={{fontSize:'0.72rem',color:'#94a3b8'}}/>
                  <Line type="monotone" dataKey="needs" stroke="#3b82f6" strokeWidth={2} dot={false} name="New Needs"/>
                  <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={false} name="Resolved"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="reports-charts-row">
            {/* Bar Chart */}
            <div className="reports-chart-card">
              <h3 className="reports-chart-title">Urgency Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.urgencyDist} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="band" tick={{fill:'#64748b',fontSize:11}}/>
                  <YAxis tick={{fill:'#64748b',fontSize:10}}/>
                  <Tooltip contentStyle={CustomTooltipStyle}/>
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {data.urgencyDist.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Horizontal Bar - Top Volunteers */}
            <div className="reports-chart-card reports-chart-card--wide">
              <h3 className="reports-chart-title">Top 10 Volunteers by Assignments</h3>
              <div className="reports-vol-bars">
                {data.topVolunteers.map((v,i) => {
                  const maxA = data.topVolunteers[0].assignments
                  return (
                    <div key={i} className="reports-vol-row">
                      <span className="reports-vol-rank">#{i+1}</span>
                      <span className="reports-vol-name">{v.name}</span>
                      <div className="reports-vol-bar"><div style={{width:`${(v.assignments/maxA)*100}%`,background:`linear-gradient(90deg,#22c55e,#06b6d4)`}}/></div>
                      <span className="reports-vol-count">{v.assignments}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Zone Heatmap */}
          <div className="reports-chart-card reports-chart-card--full">
            <h3 className="reports-chart-title">Zone Coverage Heatmap</h3>
            <div className="needs-table-wrap">
              <table className="needs-table">
                <thead><tr>
                  <th>Zone</th><th>Needs Logged</th><th>Resolved</th><th>Active</th><th>Volunteers</th><th>Coverage Score</th>
                </tr></thead>
                <tbody>
                  {data.zoneHeatmap.map(z => {
                    const sc = z.coverageScore
                    const scoreColor = sc >= 75 ? '#22c55e' : sc >= 50 ? '#f59e0b' : '#ef4444'
                    return (
                      <tr key={z.zone}>
                        <td style={{fontWeight:600,color:'#fff'}}>{z.zone}</td>
                        <td>{z.needsLogged}</td>
                        <td style={{color:'#22c55e'}}>{z.resolved}</td>
                        <td style={{color:'#f59e0b'}}>{z.active}</td>
                        <td>{z.volunteersDeployed}</td>
                        <td>
                          <div className="reports-score-cell">
                            <div className="reports-score-bar"><div style={{width:`${sc}%`,background:scoreColor}}/></div>
                            <span style={{color:scoreColor,fontWeight:700}}>{sc}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Response Time */}
          <div className="reports-chart-card reports-chart-card--full">
            <h3 className="reports-chart-title"><Activity size={16}/> Response Time Analysis</h3>
            <div className="reports-response-row">
              <div className="reports-response-stat">
                <p className="reports-response-val">{data.responseBreakdown.loggedToNotified}m</p>
                <p className="reports-response-label">Logged → Notified</p>
              </div>
              <div className="reports-response-arrow">→</div>
              <div className="reports-response-stat">
                <p className="reports-response-val">{data.responseBreakdown.notifiedToAccepted}m</p>
                <p className="reports-response-label">Notified → Accepted</p>
              </div>
              <div className="reports-response-arrow">→</div>
              <div className="reports-response-stat">
                <p className="reports-response-val">{data.responseBreakdown.acceptedToCompleted}m</p>
                <p className="reports-response-label">Accepted → Completed</p>
              </div>
            </div>
            <h4 className="reports-sub-title">By Category (avg minutes)</h4>
            <div className="reports-cat-times">
              {data.responseBreakdown.byCategory.map(c => (
                <div key={c.category} className="reports-cat-time-item">
                  <span>{c.category}</span>
                  <div className="reports-cat-time-bar"><div style={{width:`${(c.avgTime/90)*100}%`,background:c.avgTime > 60 ? '#ef4444' : c.avgTime > 30 ? '#f59e0b' : '#22c55e'}}/></div>
                  <span style={{color:c.avgTime > 60 ? '#ef4444' : c.avgTime > 30 ? '#f59e0b' : '#22c55e',fontWeight:700}}>{c.avgTime}m</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donor Report */}
          <div className="reports-chart-card reports-chart-card--full reports-donor-card">
            <div className="reports-donor-header">
              <h3 className="reports-chart-title"><FileText size={16}/> Shareable Impact Summary</h3>
              <button className="reports-edit-btn" onClick={() => { setEditDonor(!editDonor); if (!editDonor) setDonorText(data.donorText(data.summary)) }}>
                <Edit3 size={13}/> {editDonor ? 'Preview' : 'Edit'}
              </button>
            </div>
            {editDonor ? (
              <textarea className="reports-donor-textarea" value={donorText} onChange={e => setDonorText(e.target.value)} rows={5}/>
            ) : (
              <div className="reports-donor-text">{displayDonorText}</div>
            )}
            <div className="reports-donor-actions">
              <button className="reports-btn" onClick={handleCopy}>{copied ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy Text</>}</button>
              <button className="reports-btn reports-btn--accent" onClick={() => setShowEmail(true)}><Send size={14}/> Send via Email</button>
            </div>
          </div>

          {/* Export Options */}
          <div className="reports-export-row">
            <div className="reports-export-card">
              <Download size={20} style={{color:'#3b82f6'}}/>
              <h4>Download PDF Report</h4>
              <p>Formatted report with all charts and metrics</p>
              <button className="reports-btn">Download PDF</button>
            </div>
            <div className="reports-export-card">
              <FileText size={20} style={{color:'#22c55e'}}/>
              <h4>Export Raw Data (CSV)</h4>
              <p>Raw data for custom analysis</p>
              <button className="reports-btn">Download CSV</button>
            </div>
            <div className="reports-export-card">
              <Calendar size={20} style={{color:'#8b5cf6'}}/>
              <h4>Schedule Weekly Report</h4>
              <p>Auto-send reports every week</p>
              <button className="reports-btn">Schedule</button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmail && (
        <div className="modal-overlay" onClick={() => setShowEmail(false)}>
          <div className="reports-email-modal" onClick={e => e.stopPropagation()}>
            <div className="add-need-header">
              <div>
                <h2 className="add-need-title">Send Report to Donor</h2>
                <p className="add-need-subtitle">Enter donor email addresses</p>
              </div>
              <button className="assign-modal-close" onClick={() => setShowEmail(false)}><X size={20}/></button>
            </div>
            <div className="add-need-form">
              <div className="add-need-field">
                <label>Email Addresses (comma separated)</label>
                <input type="text" placeholder="donor@example.com, partner@org.com" value={emailAddr} onChange={e => setEmailAddr(e.target.value)}/>
              </div>
              <div className="reports-donor-text" style={{maxHeight:120,overflow:'auto',fontSize:'0.75rem'}}>{displayDonorText}</div>
              <div className="add-need-actions">
                <button className="drawer-btn drawer-btn--ghost" onClick={() => setShowEmail(false)}>Cancel</button>
                <button className="needs-add-btn" onClick={handleSendEmail} disabled={!emailAddr}><Send size={14}/> Send Report</button>
              </div>
            </div>
            {emailSent && <div className="assign-toast"><Check size={18}/><span>Report sent successfully!</span></div>}
          </div>
        </div>
      )}
    </div>
  )
}
