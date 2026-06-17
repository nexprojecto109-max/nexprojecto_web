import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllUsers } from '../../firebase/firestoreService'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const all = await getAllUsers()
      setUsers(all.filter(u => u.role !== 'admin'))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>
            All <span className="gradient-text">Users</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{users.length} registered students</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th>
                  <th>Purchased</th><th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      Loading users...
                    </td>
                  </tr>
                ) : users.length > 0 ? users.map(user => (
                  <tr key={user.id}>
                    <td style={{ color: 'white', fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 34, height: 34, background: 'var(--gradient)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0
                        }}>
                          {user.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-purple">
                        {(user.purchasedProjects || []).length} projects
                      </span>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No users registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
    </div>
  )
}
