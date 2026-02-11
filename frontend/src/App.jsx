import { NavLink, Route, Routes } from 'react-router-dom'
import Categories from './pages/Categories.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import Products from './pages/Products.jsx'
import './App.css'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Categories', to: '/categories' },
  { label: 'Inventory', to: '/inventory' },
]

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div>
            <p className="logo">E-COM</p>
            <p className="subtitle">Admin Console</p>
          </div>
          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `nav-link${isActive ? ' is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <main className="content">
        <div className="page-header">
          <p className="eyebrow">Product Management</p>
          <h1 className="page-title">Admin Dashboard</h1>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
