import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function AlertBanner({ message }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !message) return null

  return (
    <div className="alert-banner" id="alert-banner">
      <div className="alert-banner-content">
        <AlertTriangle size={18} className="alert-banner-icon" />
        <p className="alert-banner-text">{message}</p>
      </div>
      <button
        className="alert-banner-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss alert"
      >
        <X size={16} />
      </button>
    </div>
  )
}
