import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import { getAllProjects } from '../firebase/firestoreService'
import { FiSearch, FiFilter } from 'react-icons/fi'

const categories = ['All', 'Web Development', 'Java / JSP', 'Python / ML', 'PHP / MySQL', 'Mobile App']
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Projects() {
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    getAllProjects().then(list => {
      setAllProjects(list)
      setLoading(false)
    })
  }, [])

  let projects = allProjects.filter(p => p.status === 'active')

  if (search) projects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )
  if (selectedCat !== 'All') projects = projects.filter(p => p.category === selectedCat)
  if (selectedLevel !== 'All') projects = projects.filter(p => p.level === selectedLevel)
  if (sortBy === 'price-low') projects = [...projects].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-high') projects = [...projects].sort((a, b) => b.price - a.price)
  if (sortBy === 'rating') projects = [...projects].sort((a, b) => b.rating - a.rating)
  if (sortBy === 'popular') projects = [...projects].sort((a, b) => b.downloads - a.downloads)

  if (loading) return (
    <div className="page-wrapper" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading projects...
    </div>
  )

  return (
    <div className="page-wrapper" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', marginBottom: '0.5rem' }}>
            All <span className="gradient-text">Projects</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{projects.length} projects available</p>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap',
            marginBottom: '2rem', alignItems: 'center'
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <FiSearch style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)'
            }} />
            <input
              type="text" placeholder="Search projects..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: '2.5rem',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: '10px', color: 'white',
                fontFamily: 'Poppins', fontSize: '0.95rem', outline: 'none'
              }}
            />
          </div>

          <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}
            style={{
              padding: '0.75rem 1rem', background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '10px', color: 'white',
              fontFamily: 'Poppins', fontSize: '0.9rem', outline: 'none'
            }}>
            {levels.map(l => <option key={l} value={l} style={{ background: '#1A1133' }}>{l}</option>)}
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '0.75rem 1rem', background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '10px', color: 'white',
              fontFamily: 'Poppins', fontSize: '0.9rem', outline: 'none'
            }}>
            <option value="popular" style={{ background: '#1A1133' }}>Most Popular</option>
            <option value="rating" style={{ background: '#1A1133' }}>Highest Rated</option>
            <option value="price-low" style={{ background: '#1A1133' }}>Price: Low to High</option>
            <option value="price-high" style={{ background: '#1A1133' }}>Price: High to Low</option>
          </select>
        </motion.div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '50px',
                border: `1px solid ${selectedCat === cat ? 'var(--primary)' : 'rgba(139,92,246,0.2)'}`,
                background: selectedCat === cat ? 'var(--gradient)' : 'transparent',
                color: selectedCat === cat ? 'white' : 'var(--text-muted)',
                cursor: 'pointer', fontFamily: 'Poppins',
                fontSize: '0.85rem', fontWeight: '500',
                transition: 'all 0.3s'
              }}
            >{cat}</motion.button>
          ))}
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No projects found</h3>
            <p>Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
