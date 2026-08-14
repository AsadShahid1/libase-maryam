import { Link, router, usePage } from '@inertiajs/react'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect, useRef } from 'react'
import { getShopMetadata, getSearchSuggestions, submitContactMessage } from '@/api'
import logoFallback from '@/assets/logo.jpg'
import axios from 'axios'

export default function UserLayout({ children }) {
  const { auth, settings: sharedSettings } = usePage().props
  const user = auth?.user

  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart()

  // Use shared settings from Inertia middleware, fallback to local state for initial load
  const [settings, setSettings] = useState(sharedSettings || {})
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const suggestionRef = useRef(null)
  const userMenuRef = useRef(null)

  // Modal states (for customer sign-in/register via popup)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)

  // Load categories from metadata API
  useEffect(() => {
    getShopMetadata()
      .then(res => {
        if (!sharedSettings || Object.keys(sharedSettings).length === 0) {
          setSettings(res.data.settings || {})
        }
        setCategories(res.data.categories || [])
      })
      .catch(console.error)
  }, [])

  // Keep settings in sync with Inertia shared props
  useEffect(() => {
    if (sharedSettings && Object.keys(sharedSettings).length > 0) {
      setSettings(sharedSettings)
    }
  }, [sharedSettings])

  // Auto-suggestion search
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      getSearchSuggestions(searchQuery)
        .then(res => { setSuggestions(res.data); setShowSuggestions(true) })
        .catch(() => setSuggestions([]))
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) setShowSuggestions(false)
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    router.post('/logout')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      router.visit(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Customer login modal handler (Axios-based to avoid full-page reload)
  const handleModalLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
      await axios.post('/api/login', loginForm, { withCredentials: true, headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
      setIsLoginModalOpen(false)
      setLoginForm({ email: '', password: '' })
      // Reload the page to refresh Inertia shared auth props
      router.reload({ only: ['auth'] })
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleModalRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegisterError('')
    if (registerForm.password !== registerForm.password_confirmation) {
      setRegisterError('Passwords do not match')
      return
    }
    setRegisterLoading(true)
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
      await axios.post('/api/register', registerForm, { withCredentials: true, headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
      setIsRegisterModalOpen(false)
      setRegisterForm({ name: '', email: '', password: '', password_confirmation: '' })
      router.reload({ only: ['auth'] })
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegisterLoading(false)
    }
  }

  const logoImg = settings.company_logo || logoFallback
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'

  const navLinkStyle = (path) => ({
    color: currentPath === path ? '#d4af37' : 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: currentPath === path ? 700 : 500,
    padding: '4px 0',
    borderBottom: currentPath === path ? '2px solid #d4af37' : '2px solid transparent',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s'
  })

  return (
    <div className="user-layout">
      {/* ── Luxury Header ── */}
      <header className="navbar" style={{ height: 74, padding: '0 40px', background: '#0b132a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" className="navbar-logo" style={{ gap: 14, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src={logoImg} alt="LibaseMaryam Logo" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="navbar-logo-text" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', letterSpacing: '0.04em', color: '#fff', fontWeight: 600 }}>
              {settings.company_name || 'Libas-E-Maryam'}
            </span>
            <span style={{ fontSize: '0.65rem', color: '#d4af37', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
              {settings.company_tagline || 'A Tradition of Elegance'}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="navbar-nav" style={{ gap: 12, marginLeft: 24, display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={navLinkStyle('/')}>Home</Link>

          {/* Categories Dropdown */}
          <div style={{ position: 'relative' }} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <Link href="/categories" style={{ ...navLinkStyle('/categories'), display: 'flex', alignItems: 'center', gap: 4 }}>
              Categories <span style={{ fontSize: '0.7rem' }}>▼</span>
            </Link>
            {showDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#0b132a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', width: 220, zIndex: 100, boxShadow: 'var(--shadow)', padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
                <Link href="/categories" style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#d4af37', fontWeight: 600, textDecoration: 'none' }}>
                  Browse All Categories
                </Link>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', margin: '4px 0' }} />
                {categories.map(cat => (
                  <Link key={cat.id} href={`/products?category=${cat.slug}`}
                    style={{ padding: '8px 16px', fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/products" style={navLinkStyle('/products')}>Products</Link>
          <Link href="/about" style={navLinkStyle('/about')}>About Us</Link>
          <Link href="/contact" style={navLinkStyle('/contact')}>Contact</Link>
        </nav>

        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 300, margin: '0 24px' }} ref={suggestionRef}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search collections..."
              className="form-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ borderRadius: '99px', padding: '8px 40px 8px 16px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#ffffff' }}
            />
            <button type="submit" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>🔍</button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0b132a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius)', marginTop: 8, zIndex: 100, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
              {suggestions.map(p => (
                <div key={p.id}
                  onClick={() => { setSearchQuery(''); setShowSuggestions(false); router.visit(`/product/${p.id}`) }}
                  style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <img src={p.image} alt={p.name} style={{ width: 36, height: 48, objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#d4af37', fontWeight: 700, marginTop: 2 }}>PKR {p.price?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-actions">
          {/* Cart Button */}
          <button className="btn btn-ghost btn-sm" onClick={() => setIsCartOpen(true)} style={{ position: 'relative', padding: '8px 12px' }}>
            👜 <span style={{ marginLeft: 4 }}>Bag</span>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--brand-500)', color: '#fff', fontSize: '0.7rem', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '99px', padding: '6px 14px 6px 8px', cursor: 'pointer', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #aa820a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#000', flexShrink: 0 }}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>▾</span>
              </button>
              {showUserMenu && (
                <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#0b132a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', minWidth: 180, zIndex: 200, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{user.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{user.email}</div>
                  </div>
                  <Link href="/dashboard" onClick={() => setShowUserMenu(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >👤 My Profile</Link>
                  {user.is_admin && (
                    <Link href="/admin" onClick={() => setShowUserMenu(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: '0.85rem', color: '#d4af37', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >🛡️ Admin Dashboard</Link>
                  )}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />
                  <button onClick={() => { setShowUserMenu(false); handleLogout() }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', fontSize: '0.85rem', color: '#e57373', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,115,115,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm"
              onClick={() => setIsLoginModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700, whiteSpace: 'nowrap' }}>
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Page Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: '#0b132a', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '48px 40px 28px', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <img src={logoImg} alt="Logo" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37', marginBottom: 12 }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#fff', fontWeight: 600, marginBottom: 6 }}>
              {settings.company_name || 'Libas-E-Maryam'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              {settings.company_tagline || 'A Tradition of Elegance'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 16 }}>Quick Links</div>
            {[['/', 'Home'], ['/products', 'Products'], ['/categories', 'Categories'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginBottom: 8, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 16 }}>Contact</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
              <div>📍 {settings.company_address || 'DHA Phase 5, Lahore.'}</div>
              <div>📞 {settings.company_phone || '0321-4676591'}</div>
              <div>✉️ {settings.company_email || 'info@libasemaryam.com'}</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} {settings.company_name || 'Libas-E-Maryam'}. All rights reserved.
        </div>
      </footer>

      {/* ─── Cart Drawer ─── */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }} onClick={() => setIsCartOpen(false)}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 420, background: '#fff', zIndex: 1001, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 48px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b132a' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>Shopping Bag 👜 ({cartCount})</span>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>👜</div>
                  <p style={{ color: 'var(--text-secondary)' }}>Your bag is empty</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.cartLineId} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                    <img src={item.image} alt={item.name} style={{ width: 64, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span style={{ marginLeft: 8 }}>Color: {item.selectedColor}</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#b89028', fontSize: '0.95rem' }}>PKR {item.price?.toLocaleString()}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => updateQuantity(item.cartLineId, -1)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>−</button>
                          <span style={{ fontSize: '0.88rem', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartLineId, 1)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>+</button>
                          <button onClick={() => removeFromCart(item.cartLineId)} style={{ background: 'none', border: 'none', color: '#e57373', cursor: 'pointer', fontSize: '0.85rem', marginLeft: 4 }}>✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div style={{ padding: 20, borderTop: '1px solid var(--border)', background: 'var(--bg-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total</span>
                  <span style={{ fontWeight: 800, color: '#b89028', fontSize: '1.1rem' }}>PKR {cartTotal?.toLocaleString()}</span>
                </div>
                <Link href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #d4af37, #aa820a)', color: '#000', fontWeight: 700, padding: '14px', borderRadius: 'var(--radius)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Proceed to Checkout →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Customer Login Modal ─── */}
      {isLoginModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsLoginModalOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', background: '#fff', borderRadius: 'var(--radius)', padding: 36, width: '100%', maxWidth: 420, boxShadow: '0 24px 80px rgba(0,0,0,0.3)', zIndex: 1 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img src={logoImg} alt="Logo" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37', margin: '0 auto 12px', display: 'block' }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--text-primary)' }}>Welcome Back</h2>
            </div>
            {loginError && <div className="alert alert-error" style={{ marginBottom: 16, fontSize: '0.82rem' }}>{loginError}</div>}
            <form onSubmit={handleModalLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="email" className="form-input" placeholder="Email address" value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} required />
              <input type="password" className="form-input" placeholder="Password" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} required />
              <button type="submit" className="btn btn-primary btn-full" disabled={loginLoading}
                style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }}>
                {loginLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              New customer?{' '}
              <button style={{ background: 'none', border: 'none', color: '#b89028', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true) }}>Create account</button>
            </div>
            <button onClick={() => setIsLoginModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
          </div>
        </div>
      )}

      {/* ─── Customer Register Modal ─── */}
      {isRegisterModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsRegisterModalOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', background: '#fff', borderRadius: 'var(--radius)', padding: 36, width: '100%', maxWidth: 420, boxShadow: '0 24px 80px rgba(0,0,0,0.3)', zIndex: 1 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--text-primary)' }}>Create Account</h2>
            </div>
            {registerError && <div className="alert alert-error" style={{ marginBottom: 16, fontSize: '0.82rem' }}>{registerError}</div>}
            <form onSubmit={handleModalRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="text" className="form-input" placeholder="Full name" value={registerForm.name}
                onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))} required />
              <input type="email" className="form-input" placeholder="Email address" value={registerForm.email}
                onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))} required />
              <input type="password" className="form-input" placeholder="Password" value={registerForm.password}
                onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))} required />
              <input type="password" className="form-input" placeholder="Confirm password" value={registerForm.password_confirmation}
                onChange={e => setRegisterForm(p => ({ ...p, password_confirmation: e.target.value }))} required />
              <button type="submit" className="btn btn-primary btn-full" disabled={registerLoading}
                style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }}>
                {registerLoading ? 'Creating…' : 'Create Account'}
              </button>
            </form>
            <button onClick={() => setIsRegisterModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
