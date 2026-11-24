import { Link } from 'react-router-dom'

export default function EventCard({ event }) {
  return (
    <article className="event-card">
      <span className="event-category">{event.category}</span>
      <h3>{event.name}</h3>
      <p className="event-date">{event.date}</p>
      <p>{event.description}</p>
      <Link to={`/events/${event.id}`}>Find Out More →</Link>
    </article>
  )
}
