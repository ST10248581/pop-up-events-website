
import { useState } from 'react'
import { supabase } from './supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setMessage('')

    if (!supabase) {
      setMessage('Login is temporarily unavailable.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('You have successfully logged in!')
      }
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="register-page">
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

          <button type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}
      </div>
    </section>
  )
}
