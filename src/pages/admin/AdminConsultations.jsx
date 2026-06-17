import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllConsultations, updateConsultationDoc } from '../../firebase/firestoreService'
import toast from 'react-hot-toast'

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled']
const statusBadge = {
  pending: 'badge-yellow',
  confirmed: 'badge-purple',
  completed: 'badge-green',
  cancelled: 'badge-red'
}

export default function AdminConsultations() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getAllConsultations()
      setList(data)
      setLoading(false)
    }
    load()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await updateConsultationDoc(id, { status })
      setList(list.map(c => c.id === id ? { ...c, status } : c))
      toast.success('Status updated')
    } catch (err) {
      toast.error('Could not update status')
      console.error('[NexProjecto] consultation status update failed:', err)
    }
  }

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>
            Consultation <span className="gradient-text">Bookings</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{list.length} bookings</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Contact</th><th>College</th><th>Topic</th>
                <th>Plan</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Loading bookings...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No consultation bookings yet.
                  </td>
                </tr>
              ) : list.map(c => (
                <tr key={c.id}>
                  <td style={{ color: 'white', fontWeight: '500' }}>{c.name}</td>
                  <td>
                    <div>{c.email}</div>
                    <div style={{ fontSize: '0.8rem' }}>{c.phone}</div>
                  </td>
                  <td>{c.college}</td>
                  <td>{c.topic}</td>
                  <td><span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{c.plan}</span></td>
                  <td>{c.date}</td>
                  <td>
                    <select
                      value={c.status}
                      onChange={e => updateStatus(c.id, e.target.value)}
                      style={{
                        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)',
                        borderRadius: '8px', color: 'white', padding: '0.3rem 0.5rem', fontSize: '0.8rem',
                        fontFamily: 'Poppins'
                      }}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s} style={{ background: '#1A1133' }}>{s}</option>
                      ))}
                    </select>
                    <span className={`badge ${statusBadge[c.status]}`} style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}>{c.status}</span>
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
