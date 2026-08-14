import { createContext, useContext, useEffect, useState } from 'react'
import { getUser, logout as apiLogout } from '@/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = (userData) => setUser(userData)

  const logout = async () => {
    await apiLogout().catch(() => {})
    setUser(null)
  }

  const isAdmin = () => user?.roles?.includes('admin') ?? false
  const isUser = () => user?.roles?.includes('user') ?? false

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
