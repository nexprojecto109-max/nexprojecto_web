import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import ProjectCard from '../components/ProjectCard'
import { getAllProjects, seedProjectsIfEmpty } from '../firebase/firestoreService'
import { FiCode, FiSmartphone, FiCpu, FiDatabase, FiMessageCircle, FiZap } from 'react-icons/fi'

const categories = [
  { icon: <FiCode />, name: 'Web Development', count: 120 },
  { icon: <FiSmartphone />, name: 'Mobile Apps', count: 65 },
  { icon: <FiCpu />, name: 'AI / ML', count: 48 },
  { icon: <FiDatabase />, name: 'PHP / MySQL', count: 89 },
  { icon: <FiCode />, name: 'Java / JSP', count: 73 },
  { icon: <FiZap />, name: 'Python', count: 54 }
]

const testimonials = [
  { name: 'Rahul Sharma', college: 'VIT Vellore', text: 'Got my final year project done perfectly. The source code was clean and well-documented!', rating: 5, avatar: 'R' },
  { name: 'Priya Nair', college: 'SRM Institute', text: 'Amazing consultation service. They helped me understand every part of the project.', rating: 5, avatar: 'P' },
  { name: 'Arjun Mehta', college: 'Mumbai University', text: 'Fastest delivery and superb quality. Will definitely come back for more projects!', rating: 5, avatar: 'A' }
]

export default function Home() {
  const [projects, setProjects] = useState([])
  useEffect(() => {
    const defaultProjects = [
      { id: 'p1', title: 'E-Commerce Website (MERN Stack)', category: 'Web Development', price: 1499, originalPrice: 2999, description: 'Full-stack e-commerce with React, Node.js, MongoDB, Stripe payments, admin panel, product management, cart, and authentication.', techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'], image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop', level: 'Advanced', downloads: 342, rating: 4.8, reviews: 56, features: ['Admin Panel', 'Payment Gateway', 'Authentication', 'Product Management'], status: 'active' },
      { id: 'p2', title: 'Hospital Management System', category: 'Java / JSP', price: 1299, originalPrice: 2499, description: 'Complete hospital management with patient records, doctor appointments, billing, and admin dashboard built with Java Spring Boot.', techStack: ['Java', 'Spring Boot', 'MySQL', 'JSP', 'Bootstrap'], image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop', level: 'Advanced', downloads: 218, rating: 4.7, reviews: 43, features: ['Patient Records', 'Doctor Scheduling', 'Billing', 'Reports'], status: 'active' },
      { id: 'p3', title: 'AI Chatbot with Python', category: 'Python / ML', price: 999, originalPrice: 1999, description: 'Intelligent chatbot using Python, NLP, and machine learning. Includes training, deployment with Flask API, and React frontend.', techStack: ['Python', 'Flask', 'NLP', 'TensorFlow', 'React'], image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop', level: 'Intermediate', downloads: 189, rating: 4.9, reviews: 38, features: ['NLP Engine', 'Flask API', 'Training Module', 'React UI'], status: 'active' },
      { id: 'p4', title: 'Student Result Management', category: 'PHP / MySQL', price: 599, originalPrice: 999, description: 'PHP-based student result management system with result entry, report generation, SMS notifications, and multi-role access.', techStack: ['PHP', 'MySQL', 'Bootstrap', 'jQuery', 'FPDF'], image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop', level: 'Beginner', downloads: 421, rating: 4.6, reviews: 71, features: ['Result Entry', 'PDF Reports', 'Multi-role', 'SMS Alert'], status: 'active' },
      { id: 'p5', title: 'Food Delivery App (React Native)', category: 'Mobile App', price: 1799, originalPrice: 3499, description: 'Cross-platform food delivery app with real-time tracking, push notifications, payment gateway, and restaurant admin panel.', techStack: ['React Native', 'Firebase', 'Node.js', 'Google Maps', 'Stripe'], image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop', level: 'Advanced', downloads: 156, rating: 4.8, reviews: 29, features: ['Real-time Tracking', 'Push Notifications', 'Payment', 'Admin Panel'], status: 'active' },
      { id: 'p6', title: 'Library Management System', category: 'Java / JSP', price: 799, originalPrice: 1499, description: 'Java-based library management with book issuing, return tracking, fine calculation, member management, and reports.', techStack: ['Java', 'JDBC', 'MySQL', 'Servlet', 'JSP'], image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop', level: 'Intermediate', downloads: 287, rating: 4.5, reviews: 52, features: ['Book Issue/Return', 'Fine Calculation', 'Member Mgmt', 'Reports'], status: 'active' }
    ]
    seedProjectsIfEmpty(defaultProjects).then(() =>
      getAllProjects().then(list => setProjects(list.filter(p => p.status === 'active').slice(0, 6)))
    )
  }, [])

  return (
    <div>
      <HeroSection />

      {/* Categories */}
      <section style={{ padding: '5rem 0', background: 'rgba(139,92,246,0.03)' }}>
        <div className="container">
          <div className="section-title">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Browse by <span className="gradient-text">Category</span>
            </motion.h2>
            <p>Find projects in your preferred technology stack</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card"
                style={{ padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer' }}
              >
                <div style={{
                  width: 48, height: 48,
                  background: 'var(--gradient)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', margin: '0 auto 0.75rem',
                  boxShadow: 'var(--glow)'
                }}>{cat.icon}</div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{cat.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{cat.count} projects</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-title">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Featured <span className="gradient-text">Projects</span>
            </motion.h2>
            <p>Hand-picked best-sellers loved by students</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/projects">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary"
                style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
                View All Projects
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '5rem 0', background: 'rgba(139,92,246,0.05)' }}>
        <div className="container">
          <div className="section-title">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Why <span className="gradient-text">NexProjecto?</span>
            </motion.h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🎯', title: 'Ready-to-Submit', desc: 'All projects include documentation, report, and presentation files.' },
              { icon: '⚡', title: 'Instant Download', desc: 'Get access to your project source code immediately after payment.' },
              { icon: '🛠️', title: 'Expert Support', desc: '24/7 technical support to help you understand and customize your project.' },
              { icon: '📋', title: 'All Domains', desc: 'Web, Mobile, AI, Java, PHP, Python — every engineering domain covered.' },
              { icon: '💬', title: 'Live Consultation', desc: 'Book 1-on-1 sessions with our expert developers for personalized guidance.' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Safe and encrypted payment gateway. 100% refund if unsatisfied.' }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card"
                style={{ padding: '1.75rem' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-title">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Student <span className="gradient-text">Reviews</span>
            </motion.h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card"
                style={{ padding: '1.75rem' }}
              >
                <div style={{ display: 'flex', color: '#FCD34D', marginBottom: '1rem', fontSize: '1rem' }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 40, height: 40,
                    background: 'var(--gradient)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '1.1rem'
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t.college}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(217,70,239,0.2))',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: '24px',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15), transparent 70%)',
              animation: 'pulse-glow 4s ease-in-out infinite'
            }} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', marginBottom: '1rem', position: 'relative' }}>
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', position: 'relative' }}>
              Join 1,000+ students who've already launched their projects with NexProjecto
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link to="/register">
                <motion.button whileHover={{ scale: 1.05 }} className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
                  Create Free Account
                </motion.button>
              </Link>
              <Link to="/projects">
                <motion.button whileHover={{ scale: 1.05 }} className="btn-outline" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
                  Browse Projects
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
