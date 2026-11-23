
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function VendorDashboard({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        setMessage('Could not load your business profile: ' + error.message)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    loadProfile()
  }, [user.id])

  async function saveProfile(e) {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase
      .from('vendor_profiles')
      .update({
        business_name: profile.business_name,
        contact_name: profile.contact_name,
        email: profile.email,
        phone: profile.phone,
        description: profile.description,
      })
      .eq('user_id', user.id)

    setMessage(
      error ? 'Could not save changes: ' + error.message
        : 'Your business profile has been updated.'
    )
  }

  if (loading) return <p className="status-message">Loading your business profile...</p>

  if (!profile) {
    return (
      <section className="register-page">
        <div className="register-card vendor-dashboard">
          <p className="eyebrow">POP UP EVENTS</p>
          <h1>Vendor Dashboard</h1>
          <p>{message || 'Your vendor profile could not be found.'}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="register-page">
      <div className="register-card vendor-dashboard">
        <p className="eyebrow">POP UP EVENTS</p>
        <h1>Welcome to your Vendor Dashboard</h1>
        <p>Manage your business details below.</p>

        <form onSubmit={saveProfile}>
          <label>Business name</label>
          <input
            value={profile.business_name || ''}
            onChange={e => setProfile({
              ...profile,
              business_name: e.target.value
            })}
            required
          />

          <label>Contact person</label>
          <input
            value={profile.contact_name || ''}
            onChange={e => setProfile({
              ...profile,
              contact_name: e.target.value
            })}
          />

          <label>Business email</label>
          <input
            type="email"
            value={profile.email || ''}
            onChange={e => setProfile({
              ...profile,
              email: e.target.value
            })}
          />

          <label>Business phone</label>
          <input
            value={profile.phone || ''}
            onChange={e => setProfile({
              ...profile,
              phone: e.target.value
            })}
          />

          <label>Business description</label>
          <textarea
            value={profile.description || ''}
            onChange={e => setProfile({
              ...profile,
              description: e.target.value
            })}
            rows="4"
          />

          <button type="submit">Save Business Profile</button>
        </form>

        {message && <p className="register-message">{message}</p>}
      </div>
    </section>
  )
}
