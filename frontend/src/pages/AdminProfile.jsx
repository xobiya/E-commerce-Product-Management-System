import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'

function AdminProfile({ currentUser, onUserUpdate }) {
  const [profile, setProfile] = useState(currentUser)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', email: '' })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [toast, setToast] = useState({ type: '', text: '' })
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const initials = useMemo(() => {
    if (!profile?.name) return 'AD'
    return profile.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }, [profile])

  const loadProfile = async () => {
    setLoading(true)
    setError('')
    setToast({ type: '', text: '' })
    try {
      const response = await api.getCurrentUser()
      setProfile(response)
      setForm({ name: response.name || '', email: response.email || '' })
      onUserUpdate?.(response)
    } catch (err) {
      setError(err.message)
      setToast({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleProfileChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setSavingProfile(true)
    setError('')
    setMessage('')
    setToast({ type: '', text: '' })
    try {
      const updated = await api.updateProfile(form)
      setProfile(updated)
      setMessage('Profile updated.')
      setToast({ type: 'success', text: 'Profile updated.' })
      onUserUpdate?.(updated)
    } catch (err) {
      setError(err.message)
      setToast({ type: 'error', text: err.message })
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setSavingPassword(true)
    setError('')
    setMessage('')
    setToast({ type: '', text: '' })
    if (!passwordForm.current_password || !passwordForm.password) {
      const message = 'Please fill in all password fields.'
      setError(message)
      setToast({ type: 'error', text: message })
      setSavingPassword(false)
      return
    }
    if (passwordForm.password.length < 8) {
      const message = 'New password must be at least 8 characters.'
      setError(message)
      setToast({ type: 'error', text: message })
      setSavingPassword(false)
      return
    }
    if (passwordForm.password !== passwordForm.password_confirmation) {
      const message = 'Passwords do not match.'
      setError(message)
      setToast({ type: 'error', text: message })
      setSavingPassword(false)
      return
    }
    try {
      await api.updatePassword(passwordForm)
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' })
      setMessage('Password updated.')
      setToast({ type: 'success', text: 'Password updated.' })
    } catch (err) {
      setError(err.message)
      setToast({ type: 'error', text: err.message })
    } finally {
      setSavingPassword(false)
    }
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="page">
        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Profile</p>
              <h2 className="section-title">Admin profile</h2>
            </div>
          </div>
          <p className="helper">Only admins can access the profile page.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="page">
      {toast.text && (
        <div className={`toast toast-${toast.type}`} role="status">
          <span>{toast.text}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => setToast({ type: '', text: '' })}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h2 className="section-title">Profile overview</h2>
            <p className="lead">Manage your profile, security, and system access.</p>
          </div>
          <button type="button" className="button ghost" onClick={loadProfile}>
            Refresh
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="helper">{message}</p>}
      </section>

      <section className="section">
        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-identity">
              <div className="profile-avatar">
                <span>{initials}</span>
              </div>
              <div>
                <p className="profile-name">{profile?.name || 'Admin'}</p>
                <p className="profile-role">{profile?.role || 'admin'}</p>
                <p className="profile-meta">{profile?.email || 'admin@example.com'}</p>
                <p className="profile-meta">
                  Last login: {profile?.last_login_at ? new Date(profile.last_login_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            <button type="button" className="button">
              Change avatar (coming soon)
            </button>
          </div>

          <div className="profile-card">
            <h3 className="section-title">Profile settings</h3>
            <form className="form-grid" onSubmit={handleProfileSubmit}>
              <label className="field">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(event) => handleProfileChange('name', event.target.value)}
                  placeholder="Admin User"
                  required
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleProfileChange('email', event.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </label>
              <div className="actions full">
                <button type="submit" className="button primary" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Update profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="profile-grid">
          <div className="profile-card">
            <h3 className="section-title">Security</h3>
            <form className="form-grid" onSubmit={handlePasswordSubmit}>
              <label className="field">
                <span>Current password</span>
                <div className="password-field">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.current_password}
                    onChange={(event) => handlePasswordChange('current_password', event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </label>
              <label className="field">
                <span>New password</span>
                <div className="password-field">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.password}
                    onChange={(event) => handlePasswordChange('password', event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </label>
              <label className="field">
                <span>Confirm password</span>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.password_confirmation}
                    onChange={(event) => handlePasswordChange('password_confirmation', event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </label>
              <div className="actions full">
                <button type="submit" className="button primary" disabled={savingPassword}>
                  {savingPassword ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </form>
          </div>

          <div className="profile-card">
            <h3 className="section-title">Security options</h3>
            <p className="helper">Advanced security controls are coming soon.</p>
            <div className="security-options">
              <div className="security-row">
                <div>
                  <p className="stack-title">Two-factor authentication</p>
                  <p className="stack-subtitle">Add an extra layer of security.</p>
                </div>
                <button type="button" className="button" disabled>
                  Enable
                </button>
              </div>
              <div className="security-row">
                <div>
                  <p className="stack-title">Session timeout</p>
                  <p className="stack-subtitle">Auto-logout after inactivity.</p>
                </div>
                <button type="button" className="button" disabled>
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">System</p>
            <h3 className="section-title">Administrative actions</h3>
          </div>
        </div>
        <div className="profile-actions">
          <button type="button" className="button" disabled>
            Download audit log (coming soon)
          </button>
          <button type="button" className="button" disabled>
            Revoke all tokens (coming soon)
          </button>
        </div>
      </section>

      {loading && <p className="helper">Loading profile...</p>}
    </div>
  )
}

export default AdminProfile
