import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as apiRegister, getUser } from '@/api'
import { useAuth } from '@/contexts/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await apiRegister(form)
      const { data } = await getUser()
      login(data)
      navigate('/dashboard')
    } catch (err) {
      const errs = err.response?.data?.errors || {}
      setErrors(errs)
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label" htmlFor={key}>{label}</label>
      <input id={key} type={type} className="form-input"
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        required
      />
      {errors[key] && <span className="form-error">{errors[key][0]}</span>}
    </div>
  )

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">👗</div>
          <span className="auth-logo-text">LibaseMaryam</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join LibaseMaryam today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {field('name', 'Full name', 'text', 'John Doe')}
          {field('email', 'Email address', 'email', 'you@example.com')}
          {field('password', 'Password', 'password', '••••••••')}
          {field('password_confirmation', 'Confirm password', 'password', '••••••••')}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
