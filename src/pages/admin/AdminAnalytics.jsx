import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DB } from '../../data/db'
import {
  FiEye, FiUsers, FiMousePointer, FiShoppingCart,
  FiMessageSquare, FiTrendingUp, FiTrash2
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'

const RANGE_OPTIONS = [
  { id: 7, label: 'Last 7 days' },
  { id: 30, label: 'Last 30 days' },
  { id: 9999, label: 'All time' },
]

export default function AdminAnalytics() {
  const [range, setRange] = useState(30)
  const [events, setEvents] = useState(() => DB.getEvents())

  const filtered = useMemo(() => {
    const cutoff = Date.now() - range * 24 * 60 * 60 * 1000
    return events.filter(e => new Date(e.date).getTime() >= cutoff)
  }, [events, range])

  const stats = useMemo(() => {
    const pageViews = filtered.filter(e => e.type === 'page_view')
    const uniqueVisitors = new Set(filtered.map(e => e.visitorId)).size
    const projectViews = filtered.filter(e => e.type === 'project_view')
    const buyClicks = filtered.filter(e => e.type === 'buy_click')
    const orders = filtered.filter(e => e.type === 'order_placed')
    const whatsappClicks = filtered.filter(e => e.type === 'whatsapp_click')
    const contactSubmits = filtered.filter(e => e.type === 'contact_submit')
    const consultationSubmits = filtered.filter(e => e.type === 'consultation_submit')

    return {
      totalPageViews: pageViews.length,
      uniqueVisitors,
      projectViews: projectViews.length,
      buyClicks: buyClicks.length,
      orders: orders.length,
      whatsappClicks: whatsappClicks.length,
      contactSubmits: contactSubmits.length,
      consultationSubmits: consultationSubmits.length,
      conversionRate: buyClicks.length > 0 ? Math.round((orders.length / buyClicks.length) * 100) : 0
    }
  }, [filtered])

  // Top pages
  const topPages = useMemo(() => {
    const counts = {}
    filtered.filter(e => e.type === 'page_view').forEach(e => {
      counts[e.label] = (counts[e.label] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [filtered])

  // Top viewed / most-interest projects
  const topProjects = useMemo(() => {
    const counts = {}
    filtered.filter(e => e.type === 'project_view').forEach(e => {
      counts[e.label] = (counts[e.label] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [filtered])

  // Daily visits (for simple bar chart)
  const dailyVisits = useMemo(() => {
    const days = {}
    const numDays = Math.min(range, 30)
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      days[key] = 0
    }
    filtered.filter(e => e.type === 'page_view').forEach(e => {
      const key = e.date.split('T')[0]
      if (key in days) days[key]++
    })
    return Object.entries(days)
  }, [filtered, range])

  const maxDaily = Math.max(1, ...dailyVisits.map(([, v]) => v))

  // Recent activity feed
  const recent = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15)
  }, [filtered])

  const clearAnalytics = () => {
    if (!window.confirm('Clear all analytics data? This cannot be undone.')) return
    localStorage.removeItem('np_events')
    setEvents([])
    toast.success('Analytics data cleared')
  }

  const statCards = [
    { icon: <FiEye />, label: 'Page Views', value: stats.totalPageViews, color: '#8B5CF6' },
    { icon: <FiUsers />, label: 'Unique Visitors', value: stats.uniqueVisitors, color: '#10B981' },
    { icon: <FiMousePointer />, label: 'Project Views', value: stats.projectViews, color: '#3B82F6' },
    { icon: <FiShoppingCart />, label: 'Buy Clicks', value: stats.buyClicks, color: '#F59E0B' },
    { icon: <FiTrendingUp />, label: 'Orders Placed', value: stats.orders, color: '#EC4899' },
    { icon: <FaWhatsapp />, label: 'WhatsApp Clicks', value: stats.whatsappClicks, color: '#25D366' },
    { icon: <FiMessageSquare />, label: 'Contact Msgs', value: stats.contactSubmits, color: '#06B6D4' },
    { icon: <FiTrendingUp />, label: 'Buy→Order Rate', value: `${stats.conversionRate}%`, color: '#A78BFA' },
  ]

  const eventLabels = {
    page_view: 'Visited page',
    project_view: 'Viewed project',
    buy_click: 'Clicked Buy Now',
    order_placed: 'Placed order',
    whatsapp_click: 'Clicked WhatsApp',
    contact_submit: 'Sent contact message',
    consultation_submit: 'Booked consultation'
  }

  return (
    <div>
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>
            Website <span className="gradient-text">Analytics</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Visitor activity & interactions tracked on this browser/device
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={range}
            onChange={e => setRange(Number(e.target.value))}
            style={{
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
              color: 'white', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.85rem'
            }}
          >
            {RANGE_OPTIONS.map(o => (
              <option key={o.id} value={o.id} style={{ color: 'black' }}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={clearAnalytics}
            title="Clear analytics data"
            style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', borderRadius: '8px', padding: '0.5rem 0.75rem',
              fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
            }}
          >
            <FiTrash2 /> Clear
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.5rem',
        fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6'
      }}>
        ℹ️ This is a lightweight, no-backend analytics tracker stored in this browser's localStorage.
        It counts visits made <strong>from this device</strong>. For accurate site-wide analytics across
        all visitors (once the site is live with a real backend/server), consider adding
        <strong> Google Analytics</strong> or <strong>Plausible/Umami</strong> for a complete picture.
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '10px',
              background: `${s.color}22`, color: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', marginBottom: '0.6rem'
            }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>{s.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Daily visits chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: '700', marginBottom: '1.25rem', fontSize: '1rem' }}>Page Views (Daily)</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: 140, overflowX: 'auto' }}>
          {dailyVisits.map(([date, count]) => (
            <div key={date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 14 }}>
              <div style={{
                width: '100%', maxWidth: 22,
                height: `${(count / maxDaily) * 100}px`,
                minHeight: count > 0 ? 4 : 1,
                background: count > 0 ? 'var(--gradient)' : 'rgba(139,92,246,0.15)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s'
              }} title={`${date}: ${count} views`} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span>{dailyVisits[0]?.[0]}</span>
          <span>{dailyVisits[dailyVisits.length - 1]?.[0]}</span>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="analytics-grid">
        {/* Top pages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontWeight: '700', marginBottom: '1rem', fontSize: '1rem' }}>Most Visited Pages</h2>
          {topPages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data yet.</p>
          ) : topPages.map(([page, count]) => (
            <div key={page} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>{page}</span>
                <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>{count}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(139,92,246,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(count / topPages[0][1]) * 100}%`, height: '100%', background: 'var(--gradient)' }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Top projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontWeight: '700', marginBottom: '1rem', fontSize: '1rem' }}>Most Viewed Projects</h2>
          {topProjects.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data yet.</p>
          ) : topProjects.map(([title, count]) => (
            <div key={title} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{title}</span>
                <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>{count}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(139,92,246,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(count / topProjects[0][1]) * 100}%`, height: '100%', background: 'var(--gradient)' }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card" style={{ overflow: 'hidden' }}>
        <h2 style={{ fontWeight: '700', padding: '1.5rem 1.5rem 0', fontSize: '1rem' }}>Recent Activity</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Activity</th><th>Detail</th><th>Page</th><th>Time</th></tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>No activity recorded yet.</td></tr>
              ) : recent.map(e => (
                <tr key={e.id}>
                  <td>{eventLabels[e.type] || e.type}</td>
                  <td style={{ color: 'white' }}>{e.label || '—'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{e.path}</td>
                  <td>{new Date(e.date).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
