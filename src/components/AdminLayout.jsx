import { Link, useLocation, Outlet } from 'react-router-dom'
import { FiGrid, FiPackage, FiUsers, FiShoppingCart, FiMessageSquare, FiBarChart2 } from 'react-icons/fi'

const links = [
  { path: '/admin', label: 'Dashboard', icon: <FiGrid /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  { path: '/admin/projects', label: 'Projects', icon: <FiPackage /> },
  { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { path: '/admin/orders', label: 'Orders', icon: <FiShoppingCart /> },
  { path: '/admin/consultations', label: 'Consultations', icon: <FiMessageSquare /> },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="page-wrapper">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`admin-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
