// Local-storage-backed store for PROJECTS (catalog/seed data) and
// ANALYTICS EVENTS only.
//
// Users, orders, reviews, contact messages, and consultations now live
// in Firebase Firestore — see src/firebase/firestoreService.js.
// Authentication is handled by Firebase Auth — see src/context/AuthContext.jsx.

export const DB = {
  // ─── PROJECTS ────────────────────────────────────
  getProjects() {
    const stored = localStorage.getItem('np_projects')
    if (stored) return JSON.parse(stored)
    // Seed default projects
    const defaults = [
      {
        id: 'p1', title: 'E-Commerce Website (MERN Stack)',
        category: 'Web Development', price: 5499, originalPrice: 6999,
        description: 'Full-stack e-commerce with React, Node.js, MongoDB, Stripe payments, admin panel, product management, cart, and authentication.',
        techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
        level: 'Advanced', downloads: 42, rating: 4.8, reviews: 56,
        features: ['Admin Panel', 'Payment Gateway', 'Authentication', 'Product Management'],
        status: 'active'
      },
      {
        id: 'p2', title: 'Placement Prediction',
        category: 'Java / JSP', price: 4599, originalPrice: 8499,
        description: 'Complete hospital management with patient records, doctor appointments, billing, and admin dashboard built with Java Spring Boot.',
        techStack: ['JavaScript', 'Python', 'Flask', 'Html', 'CSS'],
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop',
        level: 'Advanced', downloads: 18, rating: 4.7, reviews: 43,
        features: ['Patient Records', 'Doctor Scheduling', 'Billing', 'Reports'],
        status: 'active'
      },
      {
        id: 'p3', title: 'Loan Default Risk ',
        category: 'Python / ML', price: 5000, originalPrice: 8999,
        description: 'Intelligent chatbot using Python, NLP, and machine learning. Includes training, deployment with Flask API, and React frontend.',
        techStack: ['Python', 'Flask', 'NLP', 'TensorFlow', 'React'],
        image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop',
        level: 'Intermediate', downloads: 189, rating: 4.9, reviews: 38,
        features: ['NLP Engine', 'Flask API', 'Training Module', 'React UI'],
        status: 'active'
      },
      {
        id: 'p4', title: 'Disease Prediction',
        category: 'PHP / MySQL', price: 5000, originalPrice: 6999,
        description: 'PHP-based student result management system with result entry, report generation, SMS notifications, and multi-role access.',
        techStack: ['PHP', 'MySQL', 'Python', 'jQuery', 'FPDF'],
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
        level: 'Beginner', downloads: 21, rating: 4.6, reviews: 71,
        features: ['Result Entry', 'PDF Reports', 'Multi-role', 'SMS Alert'],
        status: 'active'
      },
      {
        id: 'p5', title: 'Food Delivery App (MERN Stack)',
        category: 'Mobile App', price: 4000, originalPrice: 5000,
        description: 'Cross-platform food delivery app with real-time tracking, push notifications, payment gateway, and restaurant admin panel.',
        techStack: ['React Native', 'Firebase', 'Node.js', 'Google Maps', 'Stripe'],
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop',
        level: 'Advanced', downloads: 156, rating: 4.8, reviews: 29,
        features: ['Real-time Tracking', 'Push Notifications', 'Payment', 'Admin Panel'],
        status: 'active'
      },
      {
        id: 'p6', title: 'Library Management System',
        category: 'Java / JSP', price: 2999, originalPrice: 1499,
        description: 'Java-based library management with book issuing, return tracking, fine calculation, member management, and reports.',
        techStack: ['Java', 'JDBC', 'MySQL', 'Servlet', 'JSP'],
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
        level: 'Intermediate', downloads: 287, rating: 4.5, reviews: 52,
        features: ['Book Issue/Return', 'Fine Calculation', 'Member Mgmt', 'Reports'],
        status: 'active'
      }
    ]
    this.saveProjects(defaults)
    return defaults
  },
  saveProjects(projects) {
    localStorage.setItem('np_projects', JSON.stringify(projects))
  },
  addProject(project) {
    const projects = this.getProjects()
    projects.push(project)
    this.saveProjects(projects)
  },
  updateProject(id, updates) {
    const projects = this.getProjects().map(p => p.id === id ? { ...p, ...updates } : p)
    this.saveProjects(projects)
  },
  deleteProject(id) {
    const projects = this.getProjects().filter(p => p.id !== id)
    this.saveProjects(projects)
  },

  // ─── ANALYTICS / INTERACTIONS ────────────────────
  // Each event: { id, type, label, path, visitorId, userId, date }
  // type examples: 'page_view', 'project_view', 'buy_click', 'order_placed',
  //                 'whatsapp_click', 'contact_submit', 'consultation_submit'
  // Intentionally kept in localStorage (not Firestore) to avoid burning
  // through Firestore's free read/write quota on every page view/click.
  getEvents() {
    return JSON.parse(localStorage.getItem('np_events') || '[]')
  },
  saveEvents(events) {
    // Keep last 5000 events to avoid localStorage bloat
    const trimmed = events.length > 5000 ? events.slice(events.length - 5000) : events
    localStorage.setItem('np_events', JSON.stringify(trimmed))
  },
  addEvent(event) {
    const events = this.getEvents()
    events.push(event)
    this.saveEvents(events)
  },

  // Unique anonymous visitor id, persisted across sessions
  getVisitorId() {
    let id = localStorage.getItem('np_visitor_id')
    if (!id) {
      id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem('np_visitor_id', id)
    }
    return id
  }
}
