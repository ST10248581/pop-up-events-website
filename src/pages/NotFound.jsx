import { Link } from 'react-router-dom'

export default function NotFound({ message = "The page you're looking for doesn't exist." }) {
  return (
    <section className="register-page">
      <div className="register-card">
        <p className="eyebrow">PAGE NOT FOUND</p>
        <h1>Oops!</h1>
        <p>{message}</p>
        <Link to="/" className="primary-button">Back to Home</Link>
      </div>
    </section>
  )
}
