import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import logoFallback from '@/assets/logo.jpg'

const Icon = ({ name }) => {
  const icons = {
    dashboard: '📊',
    brands: '🏷️',
    categories: '🗂️',
    products: '👗',
    banners: '🖼️',
    staff: '🔑',
    contacts: '✉️',
    settings: '⚙️',
    users: '👤',
    roles: '🛡️',
    home: '🏠'
  }
  return <span style={{ marginRight: 10, fontSize: '1.1rem' }}>{icons[name] || '•'}</span>
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/brands', label: 'Manage Brands', icon: 'brands' },
  { to: '/admin/categories', label: 'Manage Categories', icon: 'categories' },
  { to: '/admin/products', label: 'Manage Products', icon: 'products' },
  { to: '/admin/banners', label: 'Manage Banners', icon: 'banners' },
  { to: '/admin/administration', label: 'Manage Admins/Staff', icon: 'staff' },
  { to: '/admin/contacts', label: 'Customer Inquiries', icon: 'contacts' },
  { to: '/admin/settings', label: 'Store Settings', icon: 'settings' },
  { to: '/admin/users', label: 'Standard Users', icon: 'users' },
  { to: '/admin/roles', label: 'Roles & Permissions', icon: 'roles' }
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A'

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: 260, background: 'var(--bg-sidebar)', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24, borderBottom: '1px solid var(--border)' }}>
          <img src={logoFallback} alt="Boutique Logo" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--brand-400)' }} />
          <div>
            <div className="sidebar-logo-text" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>LibaseMaryam</div>
            <div className="sidebar-logo-sub" style={{ fontSize: '0.72rem', color: 'var(--brand-500)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Boutique Admin</div>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="sidebar-section-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 8 }}>Modules</div>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: 8,
                fontSize: '0.85rem', color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                background: isActive ? 'var(--brand-50)' : 'none',
                borderLeft: isActive ? '3px solid var(--brand-500)' : '3px solid transparent',
                transition: '0.2s'
              })}
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}

          <div className="sidebar-section-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 8px', paddingLeft: 8 }}>Navigation</div>
          <NavLink to="/"
            className="sidebar-link"
            style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Icon name="home" />
            Go to Website
          </NavLink>
        </nav>

        <div className="sidebar-footer" style={{ padding: 20, borderTop: '1px solid var(--border)', background: 'var(--bg-card2)' }}>
          <div className="sidebar-user" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="sidebar-avatar" style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: '#fff', fontSize: '0.85rem'
            }}>{initials}</div>
            <div>
              <div className="sidebar-user-name" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div className="sidebar-user-role" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Staff Administrator</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-full btn-sm" onClick={handleLogout} style={{ width: '100%', borderColor: 'var(--border)' }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main" style={{ flex: 1, overflowY: 'auto', padding: 40 }}>
        <Outlet />
      </main>
    </div>
  )
}
