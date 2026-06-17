import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DB } from '../../data/db'
import { getAllUsers, getAllOrders, getAllConsultations } from '../../firebase/firestoreService'
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiArrowRight, FiBarChart2 } from 'react-icons/fi'

export default function AdminDashboard() {
  const projects = DB.getProjects()
  const events = DB.getEvents()
  const uniqueVisitors = new Set(events.map(e => e.visitorId)).size

  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [allUsers, allOrders, allConsultations] = await Promise.all([
        getAllUsers(), getAllOrders(), getAllConsultations()
      ])
      setUsers(allUsers.filter(u => u.role !== 'admin'))
      setOrders(allOrders)
      setConsultations(allConsultations)
      setLoading(false)
    }
    load()
  }, [])

  const revenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0)

  const stats = [
    { icon: <FiUsers />, label: 'Total Users', value: loading ? '...' : users.length, color: '#8B5CF6', link: '/admin/users' },
    { icon: <FiBarChart2 />, label: 'Visitors', value: uniqueVisitors, color: '#06B6D4', link: '/admin/analytics' },
    { icon: <FiPackage />, label: 'Projects', value: projects.length, color: '#10B981', link: '/admin/projects' },
    { icon: <FiShoppingCart />, label: 'Orders', value: loading ? '...' : orders.length, color: '#F59E0B', link: '/admin/orders' },
    { icon: <FiDollarSign />, label: 'Revenue', value: loading ? '...' : `₹${revenue.toLocaleString('en-IN')}`, color: '#EC4899', link: '/admin/orders' }
  ]

  return (
    <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '900' }}>
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>NexProjecto Control Panel</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <Link to={s.link} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '12px',
                    background: `${s.color}22`, color: s.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', marginBottom: '0.75rem'
                  }}>{s.icon}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white' }}>{s.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.label}</div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {[
            { title: 'Analytics', desc: `${uniqueVisitors} visitors tracked`, link: '/admin/analytics', icon: '📊' },
            { title: 'Manage Projects', desc: 'Add, edit, or remove projects', link: '/admin/projects', icon: '📦' },
            { title: 'View Users', desc: 'See all registered students', link: '/admin/users', icon: '👥' },
            { title: 'Orders', desc: 'View all purchase orders', link: '/admin/orders', icon: '🛒' },
            { title: 'Consultations', desc: `${consultations.length} bookings received`, link: '/admin/consultations', icon: '💬' }
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Link to={item.link} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.02, y: -4 }} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontWeight: '700', marginBottom: '0.25rem', fontSize: '1rem' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</p>
                    </div>
                    <FiArrowRight style={{ color: 'var(--primary-light)' }} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        {!loading && orders.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontWeight: '700', marginBottom: '1.25rem' }}>Recent Orders</h2>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>User ID</th><th>Project</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{order.userId?.slice(0, 8)}...</td>
                        <td style={{ color: 'white' }}>{order.projectTitle}</td>
                        <td>₹{order.amount}</td>
                        <td><span className={`badge ${order.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>{order.status}</span></td>
                        <td>{new Date(order.date).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
    </div>
  )
}
