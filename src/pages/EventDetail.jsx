import { Link, useParams } from 'react-router-dom'
import { getEvent } from '../events'
import NotFound from './NotFound'

export default function EventDetail() {
  const { id } = useParams()
  const event = getEvent(id)

  if (!event) return <NotFound message="We couldn't find that event." />

  return (
    <section className="register-page">
      <article className="register-card event-detail">
        <Link to="/events" className="back-link">← All events</Link>

        <span className="event-category">{event.category}</span>
        <h1>{event.name}</h1>

        <dl className="account-details">
          <dt>Date</dt>
          <dd>{event.date}</dd>
          <dt>Venue</dt>
          <dd>{event.venue || 'To be announced'}</dd>
          <dt>Tickets</dt>
          <dd>{event.ticketPrice ? `R${event.ticketPrice}` : 'To be announced'}</dd>
        </dl>

        <p>{event.description}</p>

        <div className="event-detail-actions">
          {/* Ticket checkout arrives in work plan Phase 5 */}
          <button type="button" className="primary-button" disabled>
            Buy Tickets (coming soon)
          </button>
          <a
            href={`mailto:popupeventsdbn@gmail.com?subject=${encodeURIComponent('Enquiry: ' + event.name)}`}
            className="outline-button"
          >
            Ask a Question
          </a>
        </div>
      </article>
    </section>
  )
}
