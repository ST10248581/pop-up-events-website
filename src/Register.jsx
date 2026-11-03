import { useState } from 'react'
import { supabase } from './supabase'

export default function Register() {
  const [accountType, setAccountType] = useState('customer')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setMessage('')

    if (!supabase) {
      setMessage('Registration is temporarily unavailable.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Your passwords do not match.')
      return
    }

    if (password.length < 8) {
      setMessage('Your password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          phone,
          account_type: accountType,
        },
      },
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Registration received! Please check your email to verify your account.')
    }
  }

  return (
    <section className="register-page">
      <div className="register-card">
        <p className="eyebrow">JOIN OUR COMMUNITY</p>
        <h1>Create Your Account</h1>
        <p>Be part of the Pop Up Events experience.</p>

        <form onSubmit={handleRegister}>
          <label>Account Type</label>
          <div className="account-options">
            <button
              type="button"
              className={accountType === 'customer' ? 'selected' : ''}
              onClick={() => setAccountType('customer')}
            >
              Customer
            </button>
            <button
              type="button"
              className={accountType === 'vendor' ? 'selected' : ''}
              onClick={() => setAccountType('vendor')}
            >
              Vendor
            </button>
          </div>

          <label>Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}
      </div>
    </section>
  )
}
