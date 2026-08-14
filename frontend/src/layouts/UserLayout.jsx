import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect, useRef } from 'react'
import { getShopMetadata, getSearchSuggestions, login as apiLogin, register as apiRegister, getUser } from '@/api'
import logoFallback from '@/assets/logo.jpg'

export default function UserLayout() {
  const { user, logout, isAdmin, login } = useAuth()
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart()
  
  // Dynamic Settings and Metadata
  const [settings, setSettings] = useState({})
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false) // Categories dropdown state
  const [showUserMenu, setShowUserMenu] = useState(false)  // User avatar dropdown state
  const userMenuRef = useRef(null)
  const suggestionRef = useRef(null)
  
  // Modals States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch categories and company settings
    getShopMetadata()
      .then(res => {
        setSettings(res.data.settings || {})
        setCategories(res.data.categories || [])
      })
      .catch(console.error)
  }, [])

  // Auto-suggestion search logic
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      getSearchSuggestions(searchQuery)
        .then(res => {
          setSuggestions(res.data)
          setShowSuggestions(true)
        })
        .catch(() => setSuggestions([]))
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Handle Modal Sign In Submit
  const handleModalLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      await apiLogin(loginForm)
      const { data } = await getUser()
      login(data)
      setIsLoginModalOpen(false)
      setLoginForm({ email: '', password: '' })
      if (data.roles?.includes('admin')) {
        navigate('/admin')
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoginLoading(false)
    }
  }

  // Handle Modal Registration Submit
  const handleModalRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegisterError('')
    if (registerForm.password !== registerForm.password_confirmation) {
      setRegisterError('Passwords do not match')
      return
    }
    setRegisterLoading(true)
    try {
      await apiRegister(registerForm)
      const { data } = await getUser()
      login(data)
      setIsRegisterModalOpen(false)
      setRegisterForm({ name: '', email: '', password: '', password_confirmation: '' })
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegisterLoading(false)
    }
  }

  const logoImg = settings.company_logo || logoFallback

  return (
    <div className="user-layout">
      {/* ── Luxury Header ── */}
      <header className="navbar" style={{ height: 74, padding: '0 40px', background: '#0b132a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link to="/" className="navbar-logo" style={{ gap: 14 }}>
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

        {/* Public Header Navigation */}
        <nav className="navbar-nav" style={{ gap: 12, marginLeft: 24, display: 'flex', alignItems: 'center' }}>
          <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          
          {/* Categories Dropdown Container */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <NavLink to="/categories" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Categories <span style={{ fontSize: '0.7rem' }}>▼</span>
            </NavLink>
            
            {showDropdown && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                background: '#0b132a', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-sm)', width: 220, zIndex: 100,
                boxShadow: 'var(--shadow)', padding: '8px 0',
                display: 'flex', flexDirection: 'column'
              }}>
                <Link to="/categories" style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#d4af37', fontWeight: 600 }}>
                  Browse All Categories
                </Link>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', margin: '4px 0' }} />
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    style={{ padding: '8px 16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/products" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
            Products
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
            Contact
          </NavLink>
        </nav>

        {/* Search Bar with Live Suggestions */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 300, margin: '0 24px' }} ref={suggestionRef}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search collections..."
              className="form-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                borderRadius: '99px',
                padding: '8px 40px 8px 16px',
                fontSize: '0.85rem',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }}
            />
            <button type="submit" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              🔍
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#0b132a', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius)', marginTop: 8, zIndex: 100,
              boxShadow: 'var(--shadow)', overflow: 'hidden'
            }}>
              {suggestions.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSearchQuery('')
                    setShowSuggestions(false)
                    navigate(`/products?search=${encodeURIComponent(p.name)}`)
                  }}
                  style={{
                    display: 'flex', gap: 10, padding: '10px 14px',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer', transition: 'background 0.2s',
                    alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <img src={p.image} alt={p.name} style={{ width: 36, height: 48, objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#d4af37', fontWeight: 700, marginTop: 2 }}>PKR {p.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-actions">
          {/* Cart Icon Button with Count badge */}
          <button className="btn btn-ghost btn-sm" onClick={() => setIsCartOpen(true)} style={{ position: 'relative', padding: '8px 12px' }}>
            👜 <span style={{ marginLeft: 4 }}>Bag</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: 'var(--brand-500)', color: '#fff',
                fontSize: '0.7rem', width: 18, height: 18,
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, boxShadow: '0 2px 8px rgba(79,110,247,0.4)'
              }}>
                {cartCount}
              </span>
            )}
          </button>


          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              {/* User Avatar Icon Button */}
              <button
                onClick={() => setShowUserMenu(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '99px',
                  padding: '6px 14px 6px 8px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  transition: 'background 0.2s'
                }}
              >
                {/* Avatar circle with initial */}
                <span style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d4af37, #aa820a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800, color: '#000', flexShrink: 0
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || '👤'}
                </span>
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>▾</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: '#0b132a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  minWidth: 180,
                  zIndex: 200,
                  overflow: 'hidden'
                }}>
                  {/* User info header */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{user.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{user.email}</div>
                  </div>

                  {/* Profile Link */}
                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 16px',
                      fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span>👤</span> My Profile
                  </Link>

                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 16px',
                        fontSize: '0.85rem', color: '#d4af37',
                        textDecoration: 'none',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <span>🛡️</span> Admin Dashboard
                    </Link>
                  )}

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />

                  {/* Sign Out */}
                  <button
                    onClick={() => { setShowUserMenu(false); handleLogout() }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '11px 16px',
                      fontSize: '0.85rem', color: '#e57373',
                      background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,115,115,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setIsLoginModalOpen(true)} style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700, whiteSpace: 'nowrap' }}>Sign in</button>
          )}
        </div>
      </header>

      {/* Main Page Content */}
      <main className="user-main">
        <Outlet context={{ settings, categories }} />
      </main>

      {/* ── Elegant Footer ── */}
      <footer className="boutique-footer" style={{ padding: '60px 40px 30px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 40 }}>
          
          {/* Logo and Boutique Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={logoImg} alt="Logo" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37' }} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                {settings.company_name || 'Libas-E-Maryam'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
              {settings.about_us_content?.slice(0, 140) || 'Traditional Eastern attire crafted with luxury textiles and delicate hand-embellished zari thread works.'}...
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
              {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noreferrer" style={{ fontSize: '1.2rem' }}>📘</a>}
              {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noreferrer" style={{ fontSize: '1.2rem' }}>📸</a>}
              {settings.social_whatsapp && <a href={settings.social_whatsapp} target="_blank" rel="noreferrer" style={{ fontSize: '1.2rem' }}>💬</a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1rem', marginBottom: 20 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem' }}>
              <Link to="/">Store Home</Link>
              <Link to="/products">All Products</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/about">Boutique Story</Link>
              <Link to="/contact">Get in Touch</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1rem', marginBottom: 20 }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem', lineHeight: 1.6 }}>
              <span>📞 {settings.company_phone || '0321-4676591'}</span>
              <span>✉️ {settings.company_email || 'info@libasemaryam.com'}</span>
              <span>📍 {settings.company_address || 'DHA Phase 5, Lahore.'}</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20, textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          &copy; {new Date().getFullYear()} {settings.company_name || 'Libas-E-Maryam'}. All Rights Reserved. Designed with Elegance.
        </div>
      </footer>

      {/* Elegant Side-over Cart Drawer */}
      {isCartOpen && (
        <div className="modal-backdrop" onClick={() => setIsCartOpen(false)} style={{ justifyContent: 'flex-end', padding: 0 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{
            maxWidth: 420, height: '100vh', borderRadius: 0,
            display: 'flex', flexDirection: 'column', padding: 24,
            animation: 'slideLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <h2 style={{ fontSize: '1.25rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Your Bag ({cartCount})</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsCartOpen(false)} style={{ padding: '4px 8px' }}>✕ Close</button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4 }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 80 }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>👜</div>
                  <p>Your shopping bag is empty</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setIsCartOpen(false)}>Shop Collections</button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.cartLineId} style={{ display: 'flex', gap: 14, borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 16 }}>
                    <img src={item.image} alt={item.name} style={{ width: 70, height: 90, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Collection: {item.category?.name || item.category || 'Uncategorized'}</span>
                        <span style={{ fontSize: '0.78rem', color: '#b89028', display: 'block', marginTop: 2, fontWeight: 600 }}>
                          Size: {item.selectedSize} | Color: {item.selectedColor}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '2px 6px' }}>
                          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }} onClick={() => updateQuantity(item.cartLineId, -1)}>−</button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }} onClick={() => updateQuantity(item.cartLineId, 1)}>+</button>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#d4af37' }}>PKR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }} onClick={() => removeFromCart(item.cartLineId)}>🗑️</button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated Total</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>PKR {cartTotal.toLocaleString()}</span>
                </div>
                <button className="btn btn-primary btn-full" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }} onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── User Sign In Modal ── */}
      {isLoginModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLoginModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, padding: 36, background: '#ffffff', border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img src={logoImg} alt="Boutique Logo" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37', margin: '0 auto 12px', display: 'block' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Boutique Sign In</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>Sign in to complete your checkout and track orders</p>
            </div>

            {loginError && <div className="alert alert-error" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>{loginError}</div>}

            <form onSubmit={handleModalLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" className="form-input" style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <input type="password" className="form-input" style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }} disabled={loginLoading}>
                {loginLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Don't have an account? <button onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }} style={{ background: 'none', border: 'none', color: '#b89028', fontWeight: 600, cursor: 'pointer' }}>Sign up</button>
            </div>
          </div>
        </div>
      )}

      {/* ── User Sign Up Modal ── */}
      {isRegisterModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, padding: 36, background: '#ffffff', border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img src={logoImg} alt="Boutique Logo" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37', margin: '0 auto 12px', display: 'block' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Create Account</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>Register to unlock premium tailored checkout</p>
            </div>

            {registerError && <div className="alert alert-error" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>{registerError}</div>}

            <form onSubmit={handleModalRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <input className="form-input" style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} value={registerForm.name} onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" className="form-input" style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} value={registerForm.email} onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <input type="password" className="form-input" style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} placeholder="Min. 8 characters" value={registerForm.password} onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
                <input type="password" className="form-input" style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} value={registerForm.password_confirmation} onChange={e => setRegisterForm(p => ({ ...p, password_confirmation: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }} disabled={registerLoading}>
                {registerLoading ? 'Creating Account…' : 'Register'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Already have an account? <button onClick={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }} style={{ background: 'none', border: 'none', color: '#b89028', fontWeight: 600, cursor: 'pointer' }}>Sign in</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
