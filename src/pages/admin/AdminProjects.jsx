import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiX, FiLoader } from 'react-icons/fi'
import {
  getAllProjects, addProjectDoc, updateProjectDoc, deleteProjectDoc
} from '../../firebase/firestoreService'

const emptyProject = {
  title: '', category: 'Web Development', price: '', originalPrice: '',
  description: '', techStack: '', level: 'Intermediate', status: 'active',
  image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop',
  downloads: 0, rating: 4.5, reviews: 0, features: ''
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyProject)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const list = await getAllProjects()
      setProjects(list)
    } catch (err) {
      toast.error('Failed to load projects')
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const openAdd = () => { setForm(emptyProject); setEditId(null); setShowModal(true) }
  const openEdit = (p) => {
    setForm({ ...p, techStack: p.techStack.join(', '), features: p.features.join(', ') })
    setEditId(p.id); setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
      features: form.features.split(',').map(s => s.trim()).filter(Boolean)
    }
    try {
      if (editId) {
        await updateProjectDoc(editId, data)
        toast.success('Project updated! ✅')
      } else {
        const newId = uuidv4()
        await addProjectDoc({ ...data, id: newId })
        toast.success('Project added to Firebase! 🎉')
      }
      setShowModal(false)
      await fetchProjects()
    } catch (err) {
      toast.error('Failed to save project. Check Firebase rules.')
      console.error(err)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProjectDoc(id)
      toast.success('Project deleted')
      await fetchProjects()
    } catch (err) {
      toast.error('Failed to delete project')
      console.error(err)
    }
  }

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Manage <span className="gradient-text">Projects</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>{projects.length} total projects • Synced with Firebase</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn-primary" onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus /> Add Project
        </motion.button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading projects from Firebase...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr><th>Project</th><th>Category</th><th>Price</th><th>Level</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'white', fontWeight: '500' }}>{p.title}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td><span className={`badge ${p.level === 'Beginner' ? 'badge-green' : p.level === 'Advanced' ? 'badge-red' : 'badge-yellow'}`}>{p.level}</span></td>
                    <td><span className={`badge ${p.status === 'active' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(p)} style={{
                          background: 'rgba(139,92,246,0.2)', border: 'none', color: 'var(--primary-light)',
                          padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem'
                        }}><FiEdit /></button>
                        <button onClick={() => handleDelete(p.id)} style={{
                          background: 'rgba(239,68,68,0.2)', border: 'none', color: '#FCA5A5',
                          padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem'
                        }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1100, padding: '1rem'
            }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: 600, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: '700' }}>{editId ? 'Edit Project' : 'Add New Project'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Project Title</label>
                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="E.g. E-commerce Website" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {['Web Development', 'Java / JSP', 'Python / ML', 'PHP / MySQL', 'Mobile App'].map(c => (
                        <option key={c} value={c} style={{ background: '#1A1133' }}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Level</label>
                    <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                      {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                        <option key={l} value={l} style={{ background: '#1A1133' }}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="999" />
                  </div>
                  <div className="form-group">
                    <label>Original Price (₹)</label>
                    <input type="number" required value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="1999" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Description</label>
                    <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Project description..." />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Tech Stack (comma-separated)</label>
                    <input required value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Features (comma-separated)</label>
                    <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Admin Panel, Authentication" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Image URL</label>
                    <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="active" style={{ background: '#1A1133' }}>Active</option>
                      <option value="inactive" style={{ background: '#1A1133' }}>Inactive</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <motion.button whileHover={{ scale: 1.02 }} type="submit" className="btn-primary"
                    style={{ flex: 1, padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    disabled={saving}>
                    {saving ? <><FiLoader /> Saving to Firebase...</> : editId ? 'Update Project' : 'Add Project'}
                  </motion.button>
                  <button type="button" className="btn-outline" onClick={() => setShowModal(false)}
                    style={{ padding: '0.8rem 1.5rem' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
