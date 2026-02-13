import { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import Activity from './pages/Activity.jsx'
import AdminProfile from './pages/AdminProfile.jsx'
import Categories from './pages/Categories.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import Login from './pages/Login.jsx'
import Products from './pages/Products.jsx'
import { api } from './services/api.js'
import './App.css'

const navItems = [
  {
    label: 'Dashboard',
    to: '/',
    roles: ['admin', 'manager', 'editor'],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    label: 'Products',
    to: '/products',
    roles: ['admin', 'manager', 'editor'],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16v10H4z" />
        <path d="M4 7l8-4 8 4" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    to: '/categories',
    roles: ['admin'],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h7v7H4z" />
        <path d="M13 6h7v7h-7z" />
        <path d="M4 13h7v7H4z" />
        <path d="M13 13h7v7h-7z" />
      </svg>
    ),
  },
  {
    label: 'Inventory',
    to: '/inventory',
    roles: ['admin', 'manager'],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v4H4z" />
        <path d="M4 10h16v10H4z" />
      </svg>
    ),
  },
  {
    label: 'Activity',
    to: '/activity',
    roles: ['admin'],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12h4l2-5 4 10 2-5h4" />
      </svg>
    ),
  },
]

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setAuthLoading(false)
      return
    }

    api
      .getCurrentUser()
      .then((user) => {
        setCurrentUser(user)
      })
      .catch(() => {
        localStorage.removeItem('auth_token')
        setCurrentUser(null)
      })
      .finally(() => {
        setAuthLoading(false)
      })
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } finally {
      localStorage.removeItem('auth_token')
      setCurrentUser(null)
    }
  }

  const openProfile = () => {
    navigate('/profile')
  }

  const visibleNavItems = useMemo(() => {
    if (!currentUser?.role) {
      return []
    }
    return navItems.filter((item) => item.roles.includes(currentUser.role))
  }, [currentUser])

  if (authLoading) {
    return (
      <div className="login-shell">
        <p className="helper">Checking session...</p>
      </div>
    )
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div>
            <p className="logo">E-COM</p>
            <p className="subtitle">Admin Console</p>
          </div>
          <nav className="nav">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `nav-link${isActive ? ' is-active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <main className="content">
        <div className="page-header">
          <div>
            <p className="eyebrow">Product Management</p>
            <h1 className="page-title">Admin Dashboard</h1>
          </div>
          <div className="user-card header-user">
            <div className="user-profile">
              <button
                type="button"
                className="avatar avatar-button"
                onClick={openProfile}
                aria-label="Open profile"
              >
                <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
                  <circle cx="24" cy="18" r="9" />
                  <path d="M8 40c3.5-7.5 10-11 16-11s12.5 3.5 16 11" />
                </svg>
              </button>
              <div>
                <p className="meta">Signed in</p>
                <p className="user-name">{currentUser.name}</p>
                <p className="user-role">{currentUser.role}</p>
              </div>
            </div>
            <button type="button" className="button ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products currentUser={currentUser} />} />
          <Route path="/categories" element={<Categories currentUser={currentUser} />} />
          <Route path="/inventory" element={<Inventory currentUser={currentUser} />} />
          <Route path="/activity" element={<Activity currentUser={currentUser} />} />
          <Route
            path="/profile"
            element={<AdminProfile currentUser={currentUser} onUserUpdate={setCurrentUser} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
