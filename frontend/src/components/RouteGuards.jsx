import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import AdminLogin from '@/pages/auth/AdminLogin'

export function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="route-loading"><div className="spinner" /></div>
  if (!user) return <AdminLogin />
  if (!user.roles?.includes('admin')) return <Navigate to="/dashboard" replace />
  return children
}

export function UserRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="route-loading"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="route-loading"><div className="spinner" /></div>
  if (user) return <Navigate to={user.roles?.includes('admin') ? '/admin' : '/dashboard'} replace />
  return children
}
