import { Navigate, useLocation } from 'react-router-dom'

// Route guard. `roles` is optional: leave it out to allow any logged-in user.
// Note: this only hides pages in the browser. Real protection is row-level security (Phase 1.7).
export default function RequireAuth({ auth, roles, children }) {
  const location = useLocation()

  if (auth.checkingUser) {
    return <p className="status-message">Checking account...</p>
  }

  if (!auth.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(auth.userRole)) {
    return <Navigate to="/" replace />
  }

  return children
}
