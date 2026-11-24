const STATUS_COPY = {
  pending_review: {
    label: 'Under review',
    heading: 'Your application is being reviewed',
    body: "Thanks for applying to trade at Pop Up Events. Our team is reviewing your application and we'll email you as soon as a decision has been made.",
  },
  declined: {
    label: 'Not approved',
    heading: 'Your application was not approved',
    body: "Unfortunately we're unable to approve your vendor application at this time. If you have any questions, or your circumstances have changed, please get in touch.",
  },
}

// TODO(Phase 1.6): confirm the real notes column name once the schema is exported.
function getAdminNotes(application) {
  return application.admin_notes ?? application.review_notes ?? application.notes ?? null
}

export default function VendorApplicationStatus({ application }) {
  const copy = STATUS_COPY[application.status] ?? STATUS_COPY.pending_review
  const statusClass = application.status === 'declined' ? 'declined' : 'pending'
  const adminNotes = getAdminNotes(application)

  return (
    <section className="register-page" id="application">
      <div className="register-card application-status">
        <p className="eyebrow">VENDOR APPLICATION</p>
        <span className={`status-badge ${statusClass}`}>{copy.label}</span>
        <h1>{copy.heading}</h1>
        <p>{copy.body}</p>

        <dl className="account-details">
          {application.business_name && (
            <>
              <dt>Business</dt>
              <dd>{application.business_name}</dd>
            </>
          )}
          {application.created_at && (
            <>
              <dt>Submitted</dt>
              <dd>{new Date(application.created_at).toLocaleDateString()}</dd>
            </>
          )}
        </dl>

        {adminNotes && (
          <div className="account-panel">
            <h2>Notes from our team</h2>
            <p className="admin-notes">{adminNotes}</p>
          </div>
        )}

        <a
          href={`mailto:popupeventsdbn@gmail.com?subject=${encodeURIComponent(
            'Vendor application: ' + (application.business_name || '')
          )}`}
          className="primary-button"
        >
          Contact Us
        </a>
      </div>
    </section>
  )
}
