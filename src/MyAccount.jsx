import { Link } from 'react-router-dom'

export default function MyAccount({ user }) {
  const fullName = user.user_metadata?.full_name
  const phone = user.user_metadata?.phone

  return (
    <section className="register-page" id="account">
      <div className="register-card account-card">
        <p className="eyebrow">MY ACCOUNT</p>
        <h1>{fullName ? `Hi, ${fullName.split(' ')[0]}!` : 'Welcome back!'}</h1>
        <p>Thanks for being part of the Pop Up Events community.</p>

        <dl className="account-details">
          {fullName && (
            <>
              <dt>Name</dt>
              <dd>{fullName}</dd>
            </>
          )}
          <dt>Email</dt>
          <dd>{user.email}</dd>
          {phone && (
            <>
              <dt>Phone</dt>
              <dd>{phone}</dd>
            </>
          )}
        </dl>

        <div className="account-panel">
          <h2>My Tickets</h2>
          {/* Filled in during work plan Phase 5 (ticket sales) */}
          <p>You don't have any tickets yet.</p>
          <p className="account-panel-hint">
            Tickets you buy for our events will appear here, ready to show at the gate.
          </p>
          <Link to="/events" className="primary-button">Browse Events</Link>
        </div>
      </div>
    </section>
  )
}
