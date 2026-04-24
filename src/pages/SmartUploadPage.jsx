import { useState, useCallback } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import { parseUploadedText, getDemoCSV } from '../services/uploadParser'
import { Upload, FileText, Image, Users, UserCheck, UserX, HelpCircle, Download, RefreshCw, Search, Eye, ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertTriangle, X, Phone, MapPin, Tag } from 'lucide-react'
import '../styles/upload.css'

export default function SmartUploadPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [results, setResults] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [viewTab, setViewTab] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  const handleFile = useCallback((f) => {
    if (!f) return
    setFile(f)
    setResults(null)

    const reader = new FileReader()
    if (f.type.startsWith('image/')) {
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(f)
    } else {
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsText(f)
    }
  }, [])

  const handleDrop = (e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]) }
  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true) }
  const handleDragLeave = () => setDragActive(false)

  const processUpload = async () => {
    setProcessing(true)
    // Simulate processing delay for realism
    await new Promise(r => setTimeout(r, 1500))

    let textToParse = ''
    if (file?.type.startsWith('image/')) {
      // For images, simulate OCR extraction (in production, call Vision API)
      textToParse = getDemoCSV() // Simulated OCR result
    } else {
      textToParse = preview
    }

    const parsed = parseUploadedText(textToParse)
    setResults(parsed)
    setProcessing(false)
  }

  const loadDemo = () => {
    const csv = getDemoCSV()
    setPreview(csv)
    setFile({ name: 'demo_data.csv', type: 'text/csv', size: csv.length })
  }

  const moveEntry = (entry, from, to) => {
    setResults(prev => {
      const newResults = { ...prev }
      newResults[from] = prev[from].filter(e => e.id !== entry.id)
      newResults[to] = [...prev[to], entry]
      return newResults
    })
  }

  const allEntries = results ? [
    ...results.providers.map(e => ({ ...e, type: 'provider' })),
    ...results.receivers.map(e => ({ ...e, type: 'receiver' })),
    ...results.unknown.map(e => ({ ...e, type: 'unknown' })),
  ] : []

  const filtered = allEntries.filter(e => {
    if (viewTab === 'providers' && e.type !== 'provider') return false
    if (viewTab === 'receivers' && e.type !== 'receiver') return false
    if (viewTab === 'unknown' && e.type !== 'unknown') return false
    if (search) {
      const s = search.toLowerCase()
      return e.name.toLowerCase().includes(s) || e.category?.toLowerCase().includes(s) || e.zone?.toLowerCase().includes(s)
    }
    return true
  })

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar title="Smart Upload" />
        <div className="dashboard-content upload-page">

          <div className="needs-header">
            <div>
              <h1 className="needs-page-title">Smart Upload</h1>
              <p className="upload-subtitle">Upload a file or photo to auto-categorize service providers & receivers</p>
            </div>
            <button className="reports-btn" onClick={loadDemo}><FileText size={14}/> Load Demo Data</button>
          </div>

          {/* Upload Zone */}
          {!results && (
            <div className={`upload-zone ${dragActive ? 'upload-zone--active' : ''}`}
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
              <div className="upload-zone-inner">
                <div className="upload-icon-wrap"><Upload size={32}/></div>
                <h3>Drop your file here</h3>
                <p>CSV, Excel, TXT, or Photo of a handwritten/printed list</p>
                <div className="upload-or">or</div>
                <label className="upload-browse-btn">
                  Browse Files
                  <input type="file" accept=".csv,.txt,.xlsx,.xls,.jpg,.jpeg,.png,.pdf" onChange={e => handleFile(e.target.files[0])} hidden/>
                </label>
                <div className="upload-formats">
                  <span><FileText size={13}/> CSV/TXT</span>
                  <span><Image size={13}/> Photo</span>
                  <span><FileText size={13}/> Excel</span>
                </div>
              </div>
            </div>
          )}

          {/* File Preview */}
          {file && !results && (
            <div className="upload-preview-card">
              <div className="upload-preview-header">
                <div className="upload-file-info">
                  {file.type?.startsWith('image/') ? <Image size={18} style={{color:'#8b5cf6'}}/> : <FileText size={18} style={{color:'#3b82f6'}}/>}
                  <div>
                    <p className="upload-file-name">{file.name}</p>
                    <p className="upload-file-size">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button className="upload-clear-btn" onClick={() => { setFile(null); setPreview('') }}><X size={16}/></button>
              </div>

              {file.type?.startsWith('image/') ? (
                <div className="upload-img-preview">
                  <img src={preview} alt="Upload preview"/>
                </div>
              ) : (
                <pre className="upload-text-preview">{preview?.substring(0, 1000)}{preview?.length > 1000 ? '\n...' : ''}</pre>
              )}

              <button className="needs-add-btn upload-process-btn" onClick={processUpload} disabled={processing}>
                {processing ? <><RefreshCw size={15} className="upload-spin"/> Processing with AI…</> : <><Sparkles size={15}/> Categorize with AI</>}
              </button>
            </div>
          )}

          {/* Results */}
          {results && (
            <>
              {/* Summary Cards */}
              <div className="upload-summary-row">
                <div className="upload-summary-card upload-summary--providers" onClick={() => setViewTab('providers')}>
                  <UserCheck size={22}/>
                  <div>
                    <p className="upload-summary-val">{results.providers.length}</p>
                    <p className="upload-summary-label">Service Providers</p>
                  </div>
                </div>
                <div className="upload-summary-card upload-summary--receivers" onClick={() => setViewTab('receivers')}>
                  <Users size={22}/>
                  <div>
                    <p className="upload-summary-val">{results.receivers.length}</p>
                    <p className="upload-summary-label">Service Receivers</p>
                  </div>
                </div>
                <div className="upload-summary-card upload-summary--unknown" onClick={() => setViewTab('unknown')}>
                  <HelpCircle size={22}/>
                  <div>
                    <p className="upload-summary-val">{results.unknown.length}</p>
                    <p className="upload-summary-label">Needs Review</p>
                  </div>
                </div>
                <div className="upload-summary-card upload-summary--total" onClick={() => setViewTab('all')}>
                  <Sparkles size={22}/>
                  <div>
                    <p className="upload-summary-val">{allEntries.length}</p>
                    <p className="upload-summary-label">Total Extracted</p>
                  </div>
                </div>
              </div>

              {/* Filter bar */}
              <div className="upload-filter-bar">
                <div className="upload-tabs">
                  {[{k:'all',l:'All'},{k:'providers',l:'Providers'},{k:'receivers',l:'Receivers'},{k:'unknown',l:'Review'}].map(t => (
                    <button key={t.k} className={`assign-tab ${viewTab===t.k?'assign-tab--active':''}`} onClick={()=>setViewTab(t.k)}>{t.l}</button>
                  ))}
                </div>
                <div className="needs-search-wrap" style={{maxWidth:260}}>
                  <Search size={15} className="needs-search-icon"/>
                  <input className="needs-search-input" placeholder="Search entries…" value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                <button className="reports-btn" onClick={() => { setFile(null); setPreview(''); setResults(null) }}><Upload size={14}/> New Upload</button>
              </div>

              {/* Results List */}
              <div className="upload-results-list">
                {filtered.map(entry => (
                  <div key={`${entry.type}-${entry.id}`} className={`upload-entry upload-entry--${entry.type}`}>
                    <div className="upload-entry-main" onClick={() => setExpandedId(expandedId === `${entry.type}-${entry.id}` ? null : `${entry.type}-${entry.id}`)}>
                      <div className="upload-entry-avatar" style={{
                        background: entry.type === 'provider' ? 'rgba(34,197,94,0.12)' : entry.type === 'receiver' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)',
                        color: entry.type === 'provider' ? '#22c55e' : entry.type === 'receiver' ? '#3b82f6' : '#f59e0b',
                      }}>{entry.name.split(' ').map(w=>w[0]).join('').substring(0,2)}</div>

                      <div className="upload-entry-info">
                        <p className="upload-entry-name">{entry.name}</p>
                        <div className="upload-entry-meta">
                          {entry.detectedCategory && <span className="upload-cat-badge"><Tag size={10}/> {entry.detectedCategory}</span>}
                          {entry.zone && <span><MapPin size={10}/> {entry.zone}</span>}
                          {entry.phone && <span><Phone size={10}/> {entry.phone}</span>}
                        </div>
                      </div>

                      <div className="upload-entry-right">
                        <span className={`upload-type-badge upload-type--${entry.type}`}>
                          {entry.type === 'provider' ? 'Provider' : entry.type === 'receiver' ? 'Receiver' : 'Review'}
                        </span>
                        <div className="upload-confidence">
                          <div className="upload-conf-bar"><div style={{width:`${entry.confidence}%`,background:entry.confidence>=70?'#22c55e':entry.confidence>=50?'#f59e0b':'#ef4444'}}/></div>
                          <span>{entry.confidence}%</span>
                        </div>
                        {expandedId === `${entry.type}-${entry.id}` ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                      </div>
                    </div>

                    {expandedId === `${entry.type}-${entry.id}` && (
                      <div className="upload-entry-expanded">
                        <div className="upload-entry-detail"><span>Raw Data:</span><span>{entry.raw}</span></div>
                        {entry.notes && <div className="upload-entry-detail"><span>Notes:</span><span>{entry.notes}</span></div>}
                        <div className="upload-entry-actions">
                          {entry.type !== 'provider' && (
                            <button className="upload-move-btn upload-move--provider" onClick={() => moveEntry(entry, entry.type === 'receiver' ? 'receivers' : 'unknown', 'providers')}>
                              <UserCheck size={13}/> Move to Providers
                            </button>
                          )}
                          {entry.type !== 'receiver' && (
                            <button className="upload-move-btn upload-move--receiver" onClick={() => moveEntry(entry, entry.type === 'provider' ? 'providers' : 'unknown', 'receivers')}>
                              <Users size={13}/> Move to Receivers
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="upload-empty"><HelpCircle size={24}/><p>No entries found in this category</p></div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
