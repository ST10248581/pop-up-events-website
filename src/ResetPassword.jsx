import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { getDevPreview } from './devPreview'

// Supabase puts link errors (e.g. an expired link) in the URL hash or query string.
// Read once on page load, before Supabase or the router tidies the URL.
function readLinkError() {
  const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search)
  if (!params.get('error') && !params.get('error_code')) return null
  return params.get('error_description')?.replace(/\+/g, ' ') || 'This reset link is invalid.'
}

// Step 2 of password reset. The emailed link logs the user in with a short-lived
// recovery session, so by the time this page renders `auth.user` is set.
// Logged-in users can also use this page to change their password.
export default function ResetPassword({ auth, homePath }) {
  const [linkError] = useState(readLinkError)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Your passwords do not match.')
      return
    }

    if (password.length < 8) {
      setMessage('Your password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      if (getDevPreview()) {
        setDone(true)
        return
      }

      if (!supabase) {
        setMessage('Supabase connection is missing.')
        return
      }

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setMessage(
          error.code === 'same_password'
            ? 'Your new password must be different from your old one.'
            : 'Could not update your password: ' + error.message
        )
        return
      }

      setDone(true)
    } catch (error) {
      setMessage('Unexpected error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  let content

  if (auth.checkingUser) {
    content = <p>Checking your reset link...</p>
  } else if (done) {
    content = (
      <>
        <p>Your password has been updated. Use it next time you log in.</p>
        <div className="event-detail-actions">
          <Link to={homePath} className="primary-button">Continue</Link>
        </div>
      </>
    )
  } else if (linkError || !auth.user) {
    content = (
      <>
        <p>
          {linkError
            ? `${linkError.replace(/\.$/, '')}.`
            : 'This reset link is invalid or has already been used.'}{' '}
          Reset links expire after a short time and can only be used once.
        </p>
        <div className="event-detail-actions">
          <Link to="/forgot-password" className="primary-button">Send a new link</Link>
        </div>
      </>
    )
  } else {
    content = (
      <>
        <p>Choose a new password for <strong>{auth.user.email}</strong>.</p>

        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save New Password'}
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}
      </>
    )
  }

  return (
    <section className="register-page" id="reset-password">
      <div className="register-card">
        <p className="eyebrow">PASSWORD RESET</p>
        <h1>Set a New Password</h1>
        {content}
      </div>
    </section>
  )
}
