// RouteGuards.jsx — DEPRECATED
// In the Inertia.js + Laravel architecture, route protection is handled
// entirely by Laravel middleware in routes/web.php:
//   - auth          → redirects unauthenticated users to /login
//   - guest         → redirects authenticated users away from login/register
//   - role:admin    → allows only admin users to access /admin/* routes
//
// These React components are no longer needed and are kept only as stubs
// to prevent import errors from any legacy code references.

export function AdminRoute({ children }) {
  return children
}

export function UserRoute({ children }) {
  return children
}

export function GuestRoute({ children }) {
  return children
}
