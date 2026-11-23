
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function AdminDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [notes, setNotes] = useState({})
  const [reviewing, setReviewing] = useState(null)

  async function loadApplications() {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('vendor_onboarding_applications')
      .select('*')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: true })

    if (error) {
      setMessage('Could not load applications: ' + error.message)
    } else {
      setApplications(data || [])
    }

    setLoading(false)
  }

  async function reviewApplication(id, decision) {
    setReviewing(id)
    setMessage('')

    const { error } = await supabase.rpc('review_vendor_application', {
      application_id: id,
      decision,
      notes: notes[id] || null,
    })

    if (error) {
      setMessage('Review failed: ' + error.message)
    } else {
      setMessage(
        decision === 'approved'
          ? 'Vendor application approved.'
          : 'Vendor application declined.'
      )
      await loadApplications()
    }

    setReviewing(null)
  }

  useEffect(() => {
    loadApplications()
  }, [])

  return (
    <section className="register-page">
      <div className="register-card admin-dashboard">
        <p className="eyebrow">POP UP EVENTS</p>
        <h1>Vendor Applications</h1>
        <p>Review and manage prospective vendors.</p>

        <button type="button" onClick={loadApplications}>
          Refresh Applications
        </button>

        {message && (
          <p className="register-message">{message}</p>
        )}

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>There are currently no pending vendor applications.</p>
        ) : (
          applications.map((application) => (
            <div className="vendor-application" key={application.id}>
              <hr />

              <h2>{application.business_name}</h2>

              <p><strong>Contact:</strong> {application.contact_name}</p>
              <p><strong>Email:</strong> {application.email}</p>
              <p><strong>Phone:</strong> {application.phone}</p>

              <p>
                <strong>Business description:</strong><br />
                {application.description || 'Not provided'}
              </p>

              <p>
                <strong>Applied:</strong>{' '}
                {new Date(application.created_at).toLocaleDateString()}
              </p>

              <label>Private admin notes</label>
              <textarea
                rows="3"
                value={notes[application.id] || ''}
                onChange={(e) =>
                  setNotes({
                    ...notes,
                    [application.id]: e.target.value,
                  })
                }
                placeholder="Add notes about this application..."
              />

              <div className="admin-actions">
                <button
                  type="button"
                  disabled={reviewing !== null}
                  onClick={() =>
                    reviewApplication(application.id, 'approved')
                  }
                >
                  {reviewing === application.id
                    ? 'Processing...'
                    : 'Approve Vendor'}
                </button>

                <button
                  type="button"
                  disabled={reviewing !== null}
                  onClick={() =>
                    reviewApplication(application.id, 'declined')
                  }
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
