import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin, getUser } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import logoFallback from '@/assets/logo.jpg'

export default function Login() {
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
      // Redirect based on designation
      navigate(data.roles?.includes('admin') ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrative credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout" style={{ background: 'var(--bg-dark)' }}>
      <div className="auth-card" style={{ background: '#ffffff', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={logoFallback} alt="Boutique Logo" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37', margin: '0 auto 16px', display: 'block' }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: 'var(--text-primary)', fontWeight: 700 }}>
            Administration Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Sign in with staff credentials to manage boutique sales and stock
          </p>
        </div>

        {error && <div className="alert alert-error" style={{ fontSize: '0.82rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email" style={{ color: 'var(--text-secondary)' }}>Email address</label>
            <input id="email" type="email" className="form-input"
              style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              placeholder="admin@libasemaryam.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input id="password" type="password" className="form-input"
              style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Access Portal'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '12px', background: 'var(--bg-card2)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Notice:</strong> Standard boutique customers should authenticate using the pop-up modal directly on the storefront.
        </div>
      </div>
    </div>
  )
}
