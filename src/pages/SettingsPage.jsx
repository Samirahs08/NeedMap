import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import { User, Bell, Shield, Palette, Globe, Database, Mail, Save, Check, ChevronRight, Moon, Sun, Smartphone, Key, Eye, EyeOff, ToggleLeft, ToggleRight } from 'lucide-react'
import '../styles/settings.css'

const tabs = [
  { id:'profile', label:'Profile', icon:User },
  { id:'notifications', label:'Notifications', icon:Bell },
  { id:'security', label:'Security', icon:Shield },
  { id:'appearance', label:'Appearance', icon:Palette },
  { id:'integrations', label:'Integrations', icon:Globe },
  { id:'data', label:'Data & Export', icon:Database },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const [profile, setProfile] = useState({
    name: 'Samira Khan', email: 'samira@hopefoundation.org', phone: '+91 98765 43210',
    role: 'Coordinator', org: 'Hope Foundation', bio: 'Senior field coordinator managing volunteer operations across 9 zones.',
  })

  const [notifs, setNotifs] = useState({
    email: true, push: true, sms: false, escalation: true, newNeed: true, volResponse: true, weeklyReport: true, dailyDigest: false,
  })

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="dashboard-layout">
      <Sidebar/>
      <div className="dashboard-main">
        <TopBar title="Settings"/>
        <div className="dashboard-content settings-page">

          <div className="settings-header">
            <h1 className="needs-page-title">Settings</h1>
            <button className="needs-add-btn" onClick={handleSave}>
              {saved ? <><Check size={15}/> Saved!</> : <><Save size={15}/> Save Changes</>}
            </button>
          </div>

          <div className="settings-layout">
            {/* Sidebar Tabs */}
            <div className="settings-tabs">
              {tabs.map(t => (
                <button key={t.id} className={`settings-tab ${activeTab===t.id?'settings-tab--active':''}`} onClick={()=>setActiveTab(t.id)}>
                  <t.icon size={16}/> <span>{t.label}</span> <ChevronRight size={14} className="settings-tab-arrow"/>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="settings-content">

              {activeTab === 'profile' && (
                <div className="settings-section">
                  <h2 className="settings-section-title">Profile Settings</h2>
                  <p className="settings-section-desc">Manage your account details and organization info</p>

                  <div className="settings-avatar-row">
                    <div className="settings-avatar">SK</div>
                    <div>
                      <p className="settings-avatar-name">{profile.name}</p>
                      <p className="settings-avatar-role">{profile.role} · {profile.org}</p>
                    </div>
                  </div>

                  <div className="settings-fields">
                    <div className="settings-field">
                      <label>Full Name</label>
                      <input value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})}/>
                    </div>
                    <div className="settings-field">
                      <label>Email</label>
                      <input type="email" value={profile.email} onChange={e=>setProfile({...profile, email:e.target.value})}/>
                    </div>
                    <div className="settings-field">
                      <label>Phone</label>
                      <input value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})}/>
                    </div>
                    <div className="settings-field">
                      <label>Role</label>
                      <input value={profile.role} onChange={e=>setProfile({...profile, role:e.target.value})}/>
                    </div>
                    <div className="settings-field settings-field--full">
                      <label>Organization</label>
                      <input value={profile.org} onChange={e=>setProfile({...profile, org:e.target.value})}/>
                    </div>
                    <div className="settings-field settings-field--full">
                      <label>Bio</label>
                      <textarea rows={3} value={profile.bio} onChange={e=>setProfile({...profile, bio:e.target.value})}/>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h2 className="settings-section-title">Notification Preferences</h2>
                  <p className="settings-section-desc">Choose how you want to be notified about platform events</p>

                  <div className="settings-group">
                    <h3 className="settings-group-title">Channels</h3>
                    {[
                      {k:'email', l:'Email Notifications', d:'Receive updates via email', icon:Mail},
                      {k:'push', l:'Push Notifications', d:'Browser push alerts', icon:Bell},
                      {k:'sms', l:'SMS Alerts', d:'Critical alerts via SMS', icon:Smartphone},
                    ].map(n => (
                      <div key={n.k} className="settings-toggle-row">
                        <n.icon size={16} className="settings-toggle-icon"/>
                        <div className="settings-toggle-info">
                          <p>{n.l}</p><span>{n.d}</span>
                        </div>
                        <button className="settings-toggle" onClick={()=>setNotifs({...notifs,[n.k]:!notifs[n.k]})}>
                          {notifs[n.k] ? <ToggleRight size={28} style={{color:'#22c55e'}}/> : <ToggleLeft size={28}/>}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="settings-group">
                    <h3 className="settings-group-title">Event Types</h3>
                    {[
                      {k:'escalation', l:'Escalation Alerts', d:'When a volunteer requests help'},
                      {k:'newNeed', l:'New Need Logged', d:'When a new need is reported'},
                      {k:'volResponse', l:'Volunteer Response', d:'When a volunteer accepts/declines'},
                      {k:'weeklyReport', l:'Weekly Summary', d:'Automatic weekly report email'},
                      {k:'dailyDigest', l:'Daily Digest', d:'Summary of daily activity'},
                    ].map(n => (
                      <div key={n.k} className="settings-toggle-row">
                        <div className="settings-toggle-info">
                          <p>{n.l}</p><span>{n.d}</span>
                        </div>
                        <button className="settings-toggle" onClick={()=>setNotifs({...notifs,[n.k]:!notifs[n.k]})}>
                          {notifs[n.k] ? <ToggleRight size={28} style={{color:'#22c55e'}}/> : <ToggleLeft size={28}/>}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="settings-section">
                  <h2 className="settings-section-title">Security Settings</h2>
                  <p className="settings-section-desc">Manage your password and account security</p>
                  <div className="settings-fields">
                    <div className="settings-field settings-field--full">
                      <label>Current Password</label>
                      <div className="settings-pass-wrap">
                        <input type={showPass?'text':'password'} placeholder="Enter current password"/>
                        <button className="settings-pass-toggle" onClick={()=>setShowPass(!showPass)}>
                          {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                    </div>
                    <div className="settings-field">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password"/>
                    </div>
                    <div className="settings-field">
                      <label>Confirm Password</label>
                      <input type="password" placeholder="Confirm new password"/>
                    </div>
                  </div>
                  <div className="settings-group" style={{marginTop:24}}>
                    <h3 className="settings-group-title">Two-Factor Authentication</h3>
                    <div className="settings-toggle-row">
                      <Key size={16} className="settings-toggle-icon"/>
                      <div className="settings-toggle-info">
                        <p>Enable 2FA</p><span>Add an extra layer of security to your account</span>
                      </div>
                      <button className="reports-btn"><Shield size={13}/> Setup 2FA</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="settings-section">
                  <h2 className="settings-section-title">Appearance</h2>
                  <p className="settings-section-desc">Customize the look and feel of your dashboard</p>
                  <div className="settings-group">
                    <h3 className="settings-group-title">Theme</h3>
                    <div className="settings-theme-row">
                      <div className="settings-theme-card settings-theme--active"><Moon size={20}/><span>Dark</span></div>
                      <div className="settings-theme-card"><Sun size={20}/><span>Light</span></div>
                      <div className="settings-theme-card"><Palette size={20}/><span>System</span></div>
                    </div>
                  </div>
                  <div className="settings-group">
                    <h3 className="settings-group-title">Accent Color</h3>
                    <div className="settings-colors">
                      {['#22c55e','#3b82f6','#8b5cf6','#ec4899','#f59e0b','#06b6d4','#ef4444'].map(c => (
                        <button key={c} className={`settings-color-btn ${c==='#22c55e'?'settings-color--active':''}`} style={{background:c}}/>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="settings-section">
                  <h2 className="settings-section-title">Integrations</h2>
                  <p className="settings-section-desc">Connect external services to enhance NeedMap</p>
                  <div className="settings-group">
                    {[
                      {name:'Twilio WhatsApp', desc:'Send/receive WhatsApp messages', status:'Connected', color:'#22c55e'},
                      {name:'Google Cloud Vision', desc:'OCR for field report photos', status:'Connected', color:'#22c55e'},
                      {name:'Google Maps', desc:'Zone mapping and distance calculation', status:'Not Connected', color:'#f59e0b'},
                      {name:'SendGrid Email', desc:'Donor reports and notifications', status:'Not Connected', color:'#f59e0b'},
                    ].map(i => (
                      <div key={i.name} className="settings-integration-card">
                        <div>
                          <p className="settings-integration-name">{i.name}</p>
                          <span className="settings-integration-desc">{i.desc}</span>
                        </div>
                        <span className="settings-integration-status" style={{color:i.color}}>{i.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="settings-section">
                  <h2 className="settings-section-title">Data & Export</h2>
                  <p className="settings-section-desc">Manage your data, backups, and exports</p>
                  <div className="settings-group">
                    {[
                      {title:'Export All Data', desc:'Download all needs, volunteers, and assignments as JSON', btn:'Export JSON'},
                      {title:'Export Volunteer List', desc:'Download registered volunteers as CSV', btn:'Export CSV'},
                      {title:'Backup Database', desc:'Create a full backup of your NeedMap data', btn:'Create Backup'},
                      {title:'Clear Cache', desc:'Clear local cached data and reload fresh', btn:'Clear Cache'},
                    ].map(d => (
                      <div key={d.title} className="settings-data-row">
                        <div>
                          <p className="settings-data-title">{d.title}</p>
                          <span className="settings-data-desc">{d.desc}</span>
                        </div>
                        <button className="reports-btn">{d.btn}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
