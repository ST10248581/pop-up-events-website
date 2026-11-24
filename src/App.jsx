import { useState, useEffect } from 'react'
import { Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import Register from './Register'
import Login from './Login'
import AdminDashboard from './AdminDashboard'
import VendorDashboard from './VendorDashboard'
import MyAccount from './MyAccount'
import VendorApplicationStatus from './VendorApplicationStatus'
import RequireAuth from './RequireAuth'
import Home from './pages/Home'
import EventsPage from './pages/EventsPage'
import EventDetail from './pages/EventDetail'
import NotFound from './pages/NotFound'
import { getDevPreview } from './devPreview'

function useAuth() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [vendorApplication, setVendorApplication] = useState(null)
  const [checkingUser, setCheckingUser] = useState(true)

  useEffect(() => {
    const preview = getDevPreview()
    if (preview) {
      setUser(preview.user)
      setUserRole(preview.role)
      setVendorApplication(preview.application)
      setCheckingUser(false)
      return
    }

    if (!supabase) {
      console.warn('Supabase settings are missing: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
      setCheckingUser(false)
      return
    }

    let mounted = true

    async function checkUser(session) {
      const currentUser = session?.user || null

      if (!mounted) return

      setUser(currentUser)
      setUserRole(null)
      setVendorApplication(null)

      if (currentUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single()

        if (!mounted) return

        const role = error ? null : data.role
        if (error) console.error('Profile role lookup failed:', error)
        setUserRole(role)

        // Vendors may still be awaiting review, so look up their latest application.
        // TODO(Phase 1.6): confirm `user_id` is the right column once the schema is exported.
        if (role !== 'admin') {
          const { data: application, error: applicationError } = await supabase
            .from('vendor_onboarding_applications')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          if (!mounted) return

          if (applicationError) {
            console.error('Vendor application lookup failed:', applicationError)
          } else {
            setVendorApplication(application)
          }
        }
      }

      if (mounted) setCheckingUser(false)
    }

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return

        setCheckingUser(true)

        setTimeout(() => {
          checkUser(session)
        }, 0)
      })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return

      if (error) {
        console.error('Session error:', error)
        setCheckingUser(false)
        return
      }

      checkUser(data.session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const hasOpenApplication = Boolean(vendorApplication && vendorApplication.status !== 'approved')

  return { user, userRole, vendorApplication, hasOpenApplication, checkingUser }
}

// Where to send someone after they log in (or if they visit /login while logged in).
function homePathFor(auth) {
  if (auth.userRole === 'admin') return '/admin'
  if (auth.hasOpenApplication || auth.userRole === 'vendor') return '/vendor'
  return '/account'
}

// Scroll to the top on page change, or to #section when the link has a hash (e.g. /#about).
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

// /login and /register: send logged-in users on to their own page.
function GuestOnly({ auth, children }) {
  const location = useLocation()
  if (auth.checkingUser) return <p className="status-message">Checking account...</p>
  if (auth.user) return <Navigate to={location.state?.from || homePathFor(auth)} replace />
  return children
}

// /vendor: approved vendors get their dashboard; anyone with an open application sees its status.
function VendorPage({ auth }) {
  if (auth.hasOpenApplication) return <VendorApplicationStatus application={auth.vendorApplication} />
  if (auth.userRole === 'vendor') return <VendorDashboard user={auth.user} />
  return <Navigate to="/account" replace />
}

export default function App() {
  const auth = useAuth()
  const { user, userRole, hasOpenApplication } = auth
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const closeMenu = () => setMenuOpen(false)

  const roleLink =
    userRole === 'admin' ? { to: '/admin', label: 'Vendor Applications' }
      : hasOpenApplication ? { to: '/vendor', label: 'My Application' }
        : userRole === 'vendor' ? { to: '/vendor', label: 'My Business' }
          : null

  async function handleLogout() {
    closeMenu()
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) console.error('Logout failed:', error)
    }
    navigate('/')
  }

  return (
    <div className="website">
      <ScrollManager />

      <header className="header">
        <Link to="/" className="logo" aria-label="Pop Up Events home" onClick={closeMenu}>
          <img src="/logo.png" alt="Pop Up Events – Creating Moments & Memories" />
        </Link>

        <button
          type="button"
          className="menu-button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/events" onClick={closeMenu}>Events</NavLink>
          <Link to="/#about" onClick={closeMenu}>About Us</Link>
          <Link to="/#contact" onClick={closeMenu}>Contact</Link>

          {user ? (
            <>
              {roleLink && <NavLink to={roleLink.to} onClick={closeMenu}>{roleLink.label}</NavLink>}
              <NavLink to="/account" title={`Logged in as ${user.email}`} onClick={closeMenu}>My Account</NavLink>
              <button type="button" className="nav-button logout-button" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>Log In</NavLink>
              <Link to="/register" className="nav-button" onClick={closeMenu}>Join Us</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<GuestOnly auth={auth}><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly auth={auth}><Register /></GuestOnly>} />
          <Route
            path="/account"
            element={<RequireAuth auth={auth}>{user && <MyAccount user={user} />}</RequireAuth>}
          />
          <Route
            path="/vendor"
            element={<RequireAuth auth={auth}><VendorPage auth={auth} /></RequireAuth>}
          />
          <Route
            path="/admin"
            element={<RequireAuth auth={auth} roles={['admin']}><AdminDashboard /></RequireAuth>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <Link to="/" className="logo footer-logo">
          <span>Pop Up</span>
          <small>EVENTS</small>
        </Link>
        <p>Creating Moments & Memories</p>
        <p>© {new Date().getFullYear()} Pop Up Events. All rights reserved.</p>
      </footer>
    </div>
  )
}
