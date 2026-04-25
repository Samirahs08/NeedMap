import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react'

function getColor(urgency) {
  if (urgency > 80) return '#ef4444' // red
  if (urgency > 50) return '#f97316' // orange
  return '#22c55e' // green
}

function getLabel(urgency) {
  if (urgency > 80) return 'Critical'
  if (urgency > 50) return 'High'
  return 'Low / Covered'
}

function createIcon(urgency) {
  const color = getColor(urgency)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
      <defs>
        <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.5"/>
        </filter>
      </defs>
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="14" cy="13" r="6" fill="white" opacity="0.9"/>
      <text x="14" y="16.5" text-anchor="middle" fill="${color}" font-weight="700" font-size="9" font-family="Inter, sans-serif">
        ${urgency}
      </text>
    </svg>`
  return L.divIcon({
    html: svg,
    className: 'custom-map-pin',
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -38],
  })
}

export default function UrgencyMap({ needs, onAssignClick }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const [collapsed, setCollapsed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (mapInstance.current || collapsed) return // already initialized or collapsed

    mapInstance.current = L.map(mapRef.current, {
      center: [19.076, 72.8777],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    })

    // Dark map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapInstance.current)

    // Zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(mapInstance.current)

    // Attribution
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('© <a href="https://carto.com">CARTO</a>')
      .addTo(mapInstance.current)

    // Legend
    const legend = L.control({ position: 'bottomright' })
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend')
      div.innerHTML = `
        <div class="map-legend-inner">
          <p class="map-legend-title">Urgency Level</p>
          <div class="map-legend-item"><span class="map-legend-dot" style="background:#ef4444"></span> Critical (>80)</div>
          <div class="map-legend-item"><span class="map-legend-dot" style="background:#f97316"></span> High (50–80)</div>
          <div class="map-legend-item"><span class="map-legend-dot" style="background:#22c55e"></span> Low / Covered (<50)</div>
        </div>`
      return div
    }
    legend.addTo(mapInstance.current)

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [collapsed])

  // Invalidate map size when expanded/collapsed changes
  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => mapInstance.current.invalidateSize(), 100)
    }
  }, [expanded])

  // Add / update markers
  useEffect(() => {
    if (!mapInstance.current) return

    // Clear old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    needs.forEach((n) => {
      const marker = L.marker([n.lat, n.lng], { icon: createIcon(n.urgency) })
        .addTo(mapInstance.current)

      // Create popup with assign button
      const popupContent = document.createElement('div')
      popupContent.className = 'map-popup'
      popupContent.innerHTML = `
        <h4 class="map-popup-title">${n.title}</h4>
        <div class="map-popup-row"><span class="map-popup-label">Zone:</span> ${n.zone}</div>
        <div class="map-popup-row"><span class="map-popup-label">Urgency:</span> <span style="color:${getColor(n.urgency)};font-weight:700">${n.urgency}/100 — ${getLabel(n.urgency)}</span></div>
        <div class="map-popup-row"><span class="map-popup-label">Reports:</span> ${n.reports}</div>
        <div class="map-popup-row"><span class="map-popup-label">Volunteers:</span> ${n.volunteersAssigned} assigned</div>
      `
      const assignBtn = document.createElement('button')
      assignBtn.className = 'map-popup-btn'
      assignBtn.textContent = 'Assign Volunteer'
      assignBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        // Close the popup first so it doesn't block the modal
        mapInstance.current.closePopup()
        if (onAssignClick) onAssignClick(n)
      })
      popupContent.appendChild(assignBtn)

      marker.bindPopup(popupContent, { className: 'dark-popup' })
      markersRef.current.push(marker)
    })
  }, [needs, onAssignClick])

  return (
    <div className={`dashboard-card urgency-map-card ${expanded ? 'urgency-map-card--expanded' : ''}`} id="urgency-map">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Live Urgency Map</h2>
        <div className="map-header-actions">
          <span className="dashboard-card-badge">{needs.length} active</span>
          <button
            className="map-toggle-btn"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Minimize map' : 'Expand map'}
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            className="map-toggle-btn"
            onClick={() => {
              setCollapsed(!collapsed)
              if (!collapsed && mapInstance.current) {
                mapInstance.current.remove()
                mapInstance.current = null
              }
            }}
            title={collapsed ? 'Show map' : 'Collapse map'}
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className={`urgency-map-container ${expanded ? 'urgency-map-container--expanded' : ''}`} ref={mapRef} />
      )}
      {collapsed && (
        <div className="map-collapsed-placeholder">
          Map collapsed — click <ChevronDown size={12} style={{display:'inline',verticalAlign:'middle'}} /> to expand
        </div>
      )}
    </div>
  )
}
