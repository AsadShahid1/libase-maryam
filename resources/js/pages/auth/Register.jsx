import { useForm, Link } from '@inertiajs/react'

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/register')
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label" htmlFor={key}>{label}</label>
      <input id={key} type={type} className="form-input"
        placeholder={placeholder}
        value={data[key]}
        onChange={e => setData(key, e.target.value)}
        required
      />
      {errors[key] && <span className="form-error">{errors[key]}</span>}
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
        <p className="auth-subtitle">Join Libas-E-Maryam today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {field('name', 'Full name', 'text', 'John Doe')}
          {field('email', 'Email address', 'email', 'you@example.com')}
          {field('password', 'Password', 'password', '••••••••')}
          {field('password_confirmation', 'Confirm password', 'password', '••••••••')}
          <button type="submit" className="btn btn-primary btn-full" disabled={processing}>
            {processing ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
