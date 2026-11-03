import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Register from './Register'
import Login from './Login'
import AdminDashboard from './AdminDashboard'

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
  
const [connectionStatus, setConnectionStatus] = useState('Checking connection...')

useEffect(() => {
  if (!supabase) {
    setConnectionStatus('Supabase settings are missing')
    setCheckingUser(false)
    return
  }

  let mounted = true

  async function checkUser(session) {
    const currentUser = session?.user || null

    setUser(currentUser)
    setUserRole(null)

    if (currentUser) {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      if (mounted) {
        setUserRole(error ? null : data.role)
      }
    }

    if (mounted) setCheckingUser(false)
  }

  supabase.auth.getSession().then(({ data, error }) => {
    if (!mounted) return

    setConnectionStatus(
      error ? 'Connection failed' : 'Connected to Supabase'
    )

    checkUser(data.session)
  })

  const { data: { subscription } } =
    supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return

      setCheckingUser(true)

      setTimeout(() => {
        checkUser(session)
      }, 0)
    })

  return () => {
    mounted = false
    subscription.unsubscribe()
  }
}, [])
}, [])
  return (
    <div className="website">
      <header className="header">
        <a href="#home" className="logo" aria-label="Pop Up Events home">
  <img src="/logo.png" alt="Pop Up Events – Creating Moments & Memories" />
</a>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#events" onClick={() => setMenuOpen(false)}>Events</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About Us</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="#register" className="nav-button" onClick={() => setMenuOpen(false)}>Join Us</a>
          <a href="#login" onClick={() => setMenuOpen(false)}>Log In</a>
        </nav>
      </header>

      <main> 
        {checkingUser ? (
  <p style={{ textAlign: 'center', padding: '20px' }}>
    Checking account...
  </p>
) : user && userRole === 'admin' ? (
  <>
    <AdminDashboard />
    <button
      type="button"
      onClick={() => supabase.auth.signOut()}
    >
      Log Out
    </button>
  </>
) : (
  <>
        
        <p style={{ textAlign: 'center', padding: '10px' }}>
  {connectionStatus}
</p>
        
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">WELCOME TO POP UP EVENTS</p>
            <h1>Creating Moments <span>& Memories</span></h1>
            <p className="hero-description">
              Bringing people together through markets, celebrations,
              family activities and unforgettable experiences.
            </p>
            <div className="hero-actions">
              <a href="#events" className="primary-button">Explore Our Events</a>
              <a href="#about" className="secondary-button">Discover More</a>
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
                <a href="#contact">Find Out More →</a>
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
<Login />
         <Register />

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
