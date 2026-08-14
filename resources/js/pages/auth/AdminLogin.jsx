// AdminLogin is deprecated — all authentication now goes through /login
// This file redirects to the main login page for backward compatibility
import { useEffect } from 'react'
import { router } from '@inertiajs/react'

export default function AdminLogin() {
  useEffect(() => {
    router.replace('/login')
  }, [])

  return null
}
