import { useState } from 'react'
import { login as apiLogin, getUser } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiLogin(form)
      const { data } = await getUser()
      login(data)
      if (data.roles?.includes('admin')) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout" style={{
      background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 60%), var(--bg-dark)'
    }}>
      <div className="auth-card" style={{ borderColor: 'rgba(212, 175, 55, 0.2)', boxShadow: 'var(--shadow), 0 0 40px rgba(212,175,55,0.1)' }}>
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)' }}>🔒</div>
          <span className="auth-logo-text" style={{ background: 'linear-gradient(90deg, #d4af37, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LibaseMaryam Admin
          </span>
        </div>
        <h1 className="auth-title" style={{ fontFamily: "'Playfair Display', serif" }}>Staff Portal</h1>
        <p className="auth-subtitle">Authorized administrators only</p>

        {error && <div className="alert alert-error" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" style={{ color: '#d4af37' }}>Admin Email</label>
            <input type="email" className="form-input"
              placeholder="admin@libasemaryam.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              style={{ borderActiveColor: '#d4af37' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ color: '#d4af37' }}>Secret Password</label>
            <input type="password" className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full"
            style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? 'Authenticating…' : 'Access Dashboard'}
          </button>
        </form>

        <div className="auth-link" style={{ marginTop: 24 }}>
          <a href="/" style={{ color: 'var(--text-secondary)' }}>← Return to Storefront</a>
        </div>
      </div>
    </div>
  )
}
