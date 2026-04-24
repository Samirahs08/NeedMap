import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

  useEffect(() => {
    if (mapInstance.current) return // already initialized

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
      mapInstance.current.remove()
      mapInstance.current = null
    }
  }, [])

  // Add / update markers
  useEffect(() => {
    if (!mapInstance.current) return

    const markers = []
    needs.forEach((n) => {
      const marker = L.marker([n.lat, n.lng], { icon: createIcon(n.urgency) })
        .addTo(mapInstance.current)

      marker.bindPopup(`
        <div class="map-popup">
          <h4 class="map-popup-title">${n.title}</h4>
          <div class="map-popup-row"><span class="map-popup-label">Zone:</span> ${n.zone}</div>
          <div class="map-popup-row"><span class="map-popup-label">Urgency:</span> <span style="color:${getColor(n.urgency)};font-weight:700">${n.urgency}/100 — ${getLabel(n.urgency)}</span></div>
          <div class="map-popup-row"><span class="map-popup-label">Reports:</span> ${n.reports}</div>
          <div class="map-popup-row"><span class="map-popup-label">Volunteers:</span> ${n.volunteersAssigned} assigned</div>
          <button class="map-popup-btn" onclick="document.dispatchEvent(new CustomEvent('assign-from-map', {detail: ${n.id}}))">
            Assign Volunteer
          </button>
        </div>`, { className: 'dark-popup' })

      markers.push(marker)
    })

    return () => markers.forEach((m) => m.remove())
  }, [needs])

  // Listen for assign clicks from popup
  useEffect(() => {
    function handler(e) {
      const need = needs.find((n) => n.id === e.detail)
      if (need && onAssignClick) onAssignClick(need)
    }
    document.addEventListener('assign-from-map', handler)
    return () => document.removeEventListener('assign-from-map', handler)
  }, [needs, onAssignClick])

  return (
    <div className="dashboard-card urgency-map-card" id="urgency-map">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Live Urgency Map</h2>
        <span className="dashboard-card-badge">{needs.length} active</span>
      </div>
      <div className="urgency-map-container" ref={mapRef} />
    </div>
  )
}
