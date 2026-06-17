import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'

// Logs a 'page_view' event every time the route changes.
// Skips admin pages so admin's own navigation doesn't pollute analytics.
export default function PageViewTracker() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return
    trackEvent('page_view', location.pathname)
  }, [location.pathname])

  return null
}
