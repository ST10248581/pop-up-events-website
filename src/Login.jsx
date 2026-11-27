
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
  e.preventDefault()
  setMessage('Connecting to Supabase...')
  setLoading(true)

  try {
    if (!supabase) {
      setMessage('Supabase connection is missing.')
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setMessage('Login failed: ' + error.message)
      return
    }

    if (data.user) {
      setMessage('Login successful! Loading your account...')
    } else {
      setMessage('Login response received, but no user was returned.')
    }

  } catch (error) {
    setMessage('Unexpected error: ' + error.message)
  } finally {
    setLoading(false)
  }
}

  return (
    <section className="register-page" id="login">
      <div className="register-card">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Log In</h1>
        <p>Sign in to your Pop Up Events account.</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Link to="/forgot-password" state={{ email: email.trim() }} className="forgot-link">
            Forgot password?
          </Link>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="form-switch">
          New to Pop Up Events? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}
