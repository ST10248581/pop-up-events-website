import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from './supabase'

// Step 1 of password reset: email the user a link to /reset-password.
export default function ForgotPassword() {
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      if (!supabase) {
        if (import.meta.env.DEV) {
          // Dev without .env: show the success screen so the flow can be previewed.
          setSent(true)
          return
        }
        setMessage('Supabase connection is missing.')
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        // This URL must be listed under Supabase Auth → URL Configuration → Redirect URLs.
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setMessage(
          error.status === 429
            ? 'Too many reset requests. Please wait a few minutes and try again.'
            : 'Could not send the reset email: ' + error.message
        )
        return
      }

      setSent(true)
    } catch (error) {
      setMessage('Unexpected error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="register-page" id="forgot-password">
      <div className="register-card">
        <p className="eyebrow">PASSWORD RESET</p>
        <h1>Forgot Your Password?</h1>

        {sent ? (
          <>
            {/* Same message whether or not the account exists, so the form can't be used to check emails. */}
            <p>
              If an account exists for <strong>{email.trim()}</strong>, we've sent it a link to reset your
              password. The link expires after a short time, so use it soon. Check your spam folder if it
              doesn't arrive.
            </p>
            <p className="form-switch">
              <button type="button" className="text-button" onClick={() => setSent(false)}>
                Use a different email
              </button>
            </p>
          </>
        ) : (
          <>
            <p>Enter the email address you signed up with and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {message && <p className="register-message">{message}</p>}
          </>
        )}

        <p className="form-switch">
          Remembered it? <Link to="/login">Back to log in</Link>
        </p>
      </div>
    </section>
  )
}
