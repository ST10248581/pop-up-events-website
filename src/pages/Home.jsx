import { Link } from 'react-router-dom'
import EventCard from '../EventCard'
import { getEvents } from '../events'

export default function Home() {
  return (
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
            <Link to="/events" className="primary-button">
              Explore Our Events
            </Link>

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
          {getEvents().map((event) => (
            <EventCard event={event} key={event.id} />
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

      <ContactSection />
    </>
  )
}

function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <p className="eyebrow">LET'S CONNECT</p>
      <h2>Stay in the loop</h2>
      <p>Follow our journey and hear about upcoming events and opportunities.</p>
      <a href="mailto:popupeventsdbn@gmail.com" className="contact-link">
        popupeventsdbn@gmail.com
      </a>
    </section>
  )
}
