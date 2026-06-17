import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DB } from '../data/db'
import { getOrdersByUser } from '../firebase/firestoreService'
import { useAuth } from '../context/AuthContext'
import { FiDownload, FiShoppingBag, FiArrowRight, FiUser } from 'react-icons/fi'

export default function UserDashboard() {
  const { user } = useAuth()

  const allProjects = DB.getProjects()
  const purchasedIds = user?.purchasedProjects || []
  const purchasedProjects = allProjects.filter(p => purchasedIds.includes(p.id))

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    async function load() {
      const list = await getOrdersByUser(user.id)
      setOrders(list.sort((a, b) => new Date(b.date) - new Date(a.date)))
      setLoadingOrders(false)
    }
    load()
  }, [user?.id])

  return (
    <div className="page-wrapper" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>
            Welcome back, <span className="gradient-text">{user?.name}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <FiShoppingBag style={{ color: '#8B5CF6', fontSize: '1.4rem' }} />
              <span style={{ color: 'var(--text-muted)' }}>Purchased Projects</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{purchasedProjects.length}</div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <FiUser style={{ color: '#10B981', fontSize: '1.4rem' }} />
              <span style={{ color: 'var(--text-muted)' }}>Account Type</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>

        {/* Purchased Projects */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem' }}>My Projects</h2>
        {purchasedProjects.length === 0 ? (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              You haven't purchased any projects yet.
            </p>
            <Link to="/projects" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem' }}>
              Browse Projects <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {purchasedProjects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card"
                style={{ overflow: 'hidden' }}
              >
                <img src={p.image} alt={p.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                <div style={{ padding: '1.25rem' }}>
                  <span className="badge badge-purple" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{p.category}</span>
                  <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.75rem' }}>{p.title}</h3>
                  <Link
                    to={`/projects/${p.id}`}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', fontSize: '0.9rem' }}
                  >
                    <FiDownload /> View / Download
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order History */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem' }}>Order History</h2>
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {loadingOrders ? (
            <p style={{ color: 'var(--text-muted)', padding: '1.5rem', textAlign: 'center' }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '1.5rem', textAlign: 'center' }}>No orders yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>{o.projectTitle}</td>
                      <td>₹{o.amount}</td>
                      <td>
                        <span className={`badge ${o.status === 'completed' ? 'badge-green' : 'badge-yellow'}`} style={{ textTransform: 'capitalize' }}>{o.status}</span>
                      </td>
                      <td>{new Date(o.date).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
