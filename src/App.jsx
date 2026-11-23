
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Register from './Register'
import Login from './Login'
import AdminDashboard from './AdminDashboard'
import VendorDashboard from './VendorDashboard'

const events = [
  {
    name: 'The Treasure Patch Market',
    date: 'Coming Soon',
    category: 'Family Market',
    description: 'Discover unique stalls, wonderful finds and fun activities for the whole family.',
  },
  {
    name: 'Kids Events & Activities',
    date: 'Coming Soon',
    category: 'Children',
    description: 'Creative activities, competitions and memorable experiences for little ones.',
  },
  {
    name: 'Social Events & Celebrations',
    date: 'Coming Soon',
    category: 'Social',
    description: 'Bringing people together through exciting and unforgettable events.',
  },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [checkingUser, setCheckingUser] = useState(true)
  useEffect(() => {
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

      if (currentUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single()

        if (!mounted) return

        if (error) {
          console.error('Profile role lookup failed:', error)
          setUserRole(null)
        } else {
          setUserRole(data.role)
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

  const showDashboard = !checkingUser && user && (userRole === 'admin' || userRole === 'vendor')
  const closeMenu = () => setMenuOpen(false)

  async function handleLogout() {
    closeMenu()
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Logout failed:', error)
    window.scrollTo(0, 0)
  }

  return (
    <div className="website">
      <header className="header">
        <a href="#home" className="logo" aria-label="Pop Up Events home" onClick={closeMenu}>
          <img src="/logo.png" alt="Pop Up Events – Creating Moments & Memories" />
        </a>

        <button
          type="button"
          className="menu-button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {showDashboard ? (
            <a href="#dashboard" onClick={closeMenu}>
              {userRole === 'admin' ? 'Vendor Applications' : 'My Business'}
            </a>
          ) : (
            <>
              <a href="#home" onClick={closeMenu}>Home</a>
              <a href="#events" onClick={closeMenu}>Events</a>
              <a href="#about" onClick={closeMenu}>About Us</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
            </>
          )}

          {user ? (
            <>
              <span className="nav-user" title={user.email}>{user.email}</span>
              <button type="button" className="nav-button logout-button" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <a href="#register" className="nav-button" onClick={closeMenu}>Join Us</a>
              <a href="#login" onClick={closeMenu}>Log In</a>
            </>
          )}
        </nav>
      </header>

      <main>
        {checkingUser ? (
          <p className="status-message">Checking account...</p>
        ) : showDashboard ? (
          <div id="dashboard">
            {userRole === 'admin' ? <AdminDashboard /> : <VendorDashboard user={user} />}
          </div>
        ) : (
          <>
            <section className="hero" id="home">
              <div className="hero-content">
                <p className="eyebrow">WELCOME TO POP UP EVENTS</p>

                <h1>
                  Creating Moments <span>& Memories</span>
                </h1>

                <p className="hero-description">
                  Bringing people together through markets, celebrations,
                  family activities and unforgettable experiences.
                </p>

                <div className="hero-actions">
                  <a href="#events" className="primary-button">
                    Explore Our Events
                  </a>

                  <a href="#about" className="secondary-button">
                    Discover More
                  </a>
                </div>
              </div>

              <div className="hero-decoration">
                <span>Celebrate</span>
                <span>Connect</span>
                <span>Experience</span>
              </div>
            </section>

            <section className="intro" id="about">
              <p className="eyebrow">MORE THAN JUST AN EVENT</p>
              <h2>Bringing people together</h2>
              <p>
                At Pop Up Events, we believe the best memories are made when
                people come together. From vibrant markets to fun-filled
                family days and special social occasions, there's always
                something to look forward to.
              </p>
            </section>

            <section className="events-section" id="events">
              <div className="section-heading">
                <p className="eyebrow">WHAT'S HAPPENING</p>
                <h2>Discover Our Events</h2>
                <p>There is something special waiting for everyone.</p>
              </div>

              <div className="event-grid">
                {events.map((event) => (
                  <article className="event-card" key={event.name}>
                    <span className="event-category">{event.category}</span>
                    <h3>{event.name}</h3>
                    <p className="event-date">{event.date}</p>
                    <p>{event.description}</p>
                    {/* Placeholder until event pages exist (work plan Phase 3) */}
                    <a
                      href={`mailto:popupeventsdbn@gmail.com?subject=${encodeURIComponent('Enquiry: ' + event.name)}`}
                    >
                      Find Out More →
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section className="join-section" id="join">
              <p className="eyebrow">BE PART OF THE EXPERIENCE</p>
              <h2>Join the Pop Up Events community</h2>
              <p>
                Whether you're attending an event or interested in becoming
                a vendor, we'd love to have you involved.
              </p>
              <a href="#contact" className="primary-button">Get In Touch</a>
            </section>

            {!user && (
              <>
                <Login />
                <Register />
              </>
            )}

            <section className="contact-section" id="contact">
              <p className="eyebrow">LET'S CONNECT</p>
              <h2>Stay in the loop</h2>
              <p>Follow our journey and hear about upcoming events and opportunities.</p>
              <a href="mailto:popupeventsdbn@gmail.com" className="contact-link">
                popupeventsdbn@gmail.com
              </a>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <a href="#home" className="logo footer-logo">
          <span>Pop Up</span>
          <small>EVENTS</small>
        </a>
        <p>Creating Moments & Memories</p>
        <p>© {new Date().getFullYear()} Pop Up Events. All rights reserved.</p>
      </footer>
    </div>
  )
}
