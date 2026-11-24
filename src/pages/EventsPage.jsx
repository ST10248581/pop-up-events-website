import EventCard from '../EventCard'
import { getEvents } from '../events'

export default function EventsPage() {
  const events = getEvents()

  return (
    <section className="events-section page-section">
      <div className="section-heading">
        <p className="eyebrow">WHAT'S HAPPENING</p>
        <h1>Our Events</h1>
        <p>Markets, family days and celebrations. There's something for everyone.</p>
      </div>

      {events.length === 0 ? (
        <p className="status-message">No upcoming events right now. Check back soon!</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      )}
    </section>
  )
}
