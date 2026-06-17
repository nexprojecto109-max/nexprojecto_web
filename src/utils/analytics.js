import { v4 as uuidv4 } from 'uuid'
import { DB } from '../data/db'
import { auth } from '../firebase/config'

/**
 * Logs a generic interaction event to localStorage for the Admin Analytics
 * dashboard. This is a lightweight, no-backend analytics tracker.
 *
 * type:  'page_view' | 'project_view' | 'buy_click' | 'order_placed'
 *      | 'whatsapp_click' | 'contact_submit' | 'consultation_submit'
 * label: human-readable detail (e.g. project title, page name)
 */
export function trackEvent(type, label = '', extra = {}) {
  try {
    DB.addEvent({
      id: uuidv4(),
      type,
      label,
      path: window.location.pathname,
      visitorId: DB.getVisitorId(),
      userId: auth.currentUser?.uid || null,
      date: new Date().toISOString(),
      ...extra
    })
  } catch (e) {
    // Fail silently — analytics should never break the app
    console.warn('[NexProjecto] trackEvent failed:', e)
  }
}
