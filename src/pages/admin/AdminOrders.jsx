import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllOrders, updateOrderDoc } from '../../firebase/firestoreService'
import { FaWhatsapp } from 'react-icons/fa'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    const list = await getAllOrders()
    setOrders(list)
    setLoading(false)
  }

  const markCompleted = async (id) => {
    await updateOrderDoc(id, { status: 'completed' })
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'completed' } : o))
  }

  return (
    <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>
            All <span className="gradient-text">Orders</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {orders.length} orders &middot; ₹{totalRevenue.toLocaleString('en-IN')} confirmed revenue
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Phone</th>
                  <th>Txn ID</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                      No orders yet.
                    </td>
                  </tr>
                ) : orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id.slice(0, 8)}...</td>
                    <td>{o.projectTitle}</td>
                    <td>₹{o.amount}</td>
                    <td>
                      {o.phone ? (
                        <a href={`https://wa.me/91${o.phone.replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
                          <FaWhatsapp /> {o.phone}
                        </a>
                      ) : '—'}
                    </td>
                    <td>{o.transactionId || '—'}</td>
                    <td>
                      <span className={`badge ${o.status === 'completed' ? 'badge-green' : 'badge-yellow'}`} style={{ textTransform: 'capitalize' }}>{o.status}</span>
                    </td>
                    <td>{new Date(o.date).toLocaleDateString('en-IN')}</td>
                    <td>
                      {o.status !== 'completed' && (
                        <button
                          onClick={() => markCompleted(o.id)}
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
    </div>
  )
}
