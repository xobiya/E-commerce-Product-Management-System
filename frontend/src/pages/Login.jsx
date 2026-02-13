import { useState } from 'react'
import { api } from '../services/api.js'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.login({ email, password })
      localStorage.setItem('auth_token', response.token)
      onLogin(response.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-orb login-orb-one" aria-hidden="true" />
      <div className="login-orb login-orb-two" aria-hidden="true" />
      <div className="login-card login-card-split">
        <div className="login-hero">
          <p className="login-badge">E-COM ADMIN</p>
          <h2 className="login-title">Secure access to your commerce engine.</h2>
          <p className="login-subtitle">
            Manage products, inventory, and system controls from one clean console.
          </p>
          <div className="login-points">
            <div>
              <p className="stack-title">Inventory clarity</p>
              <p className="stack-subtitle">Live stock movement and alerts.</p>
            </div>
            <div>
              <p className="stack-title">Audit-ready</p>
              <p className="stack-subtitle">Track every change in real time.</p>
            </div>
            <div>
              <p className="stack-title">Role-based control</p>
              <p className="stack-subtitle">Permissioned access for admins.</p>
            </div>
          </div>
        </div>
        <div className="login-form">
          <p className="eyebrow">Admin Access</p>
          <h2 className="section-title">Sign in</h2>
          <p className="lead">Use your admin credentials to manage the catalog.</p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
            <div className="actions full">
              <button type="submit" className="button primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
            {error && <p className="form-error full">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
