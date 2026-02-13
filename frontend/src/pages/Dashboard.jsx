import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const emptySummary = {
  totals: {
    products: 0,
    categories: 0,
    inventory_records: 0,
    low_stock: 0,
  },
  low_stock_items: [],
  recent_activity: [],
  stock_trends: [],
}

function Dashboard() {
  const [summary, setSummary] = useState(emptySummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSummary = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.getDashboardSummary()
      setSummary(response || emptySummary)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  const formatDate = (value) => {
    if (!value) return 'N/A'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.valueOf())) return 'N/A'
    return parsed.toLocaleString()
  }

  const formatShortDate = (value) => {
    if (!value) return 'N/A'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.valueOf())) return 'N/A'
    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const trendMax = Math.max(1, ...summary.stock_trends.map((trend) => trend.updates))
  const chartHeight = 140

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Control Center</p>
            <h2 className="section-title">
              Keep products, categories, and inventory in sync.
            </h2>
            <p className="lead">
              Use the navigation on the left to manage your catalog. This dashboard
              is optimized for fast updates and clear visibility into stock.
            </p>
          </div>
          <button type="button" className="button ghost" onClick={loadSummary}>
            Refresh
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h3 className="section-title">At a glance</h3>
          </div>
          {loading && <p className="meta">Loading...</p>}
        </div>
        <div className="kpi-grid">
          <div className="kpi-card">
            <p className="kpi-label">Products</p>
            <p className="kpi-value">{summary.totals.products}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Categories</p>
            <p className="kpi-value">{summary.totals.categories}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Inventory Records</p>
            <p className="kpi-value">{summary.totals.inventory_records}</p>
          </div>
          <div className="kpi-card alert">
            <p className="kpi-label">Low Stock Items</p>
            <p className="kpi-value">{summary.totals.low_stock}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Inventory Alerts</p>
            <h3 className="section-title">Low stock list</h3>
          </div>
          <p className="meta">Top {summary.low_stock_items.length} items</p>
        </div>
        {loading ? (
          <p className="helper">Loading alerts...</p>
        ) : summary.low_stock_items.length === 0 ? (
          <p className="helper">No low stock items.</p>
        ) : (
          <div className="stack-list">
            {summary.low_stock_items.map((item) => (
              <div key={item.id} className="stack-row">
                <div>
                  <p className="stack-title">{item.product?.name || 'Product'}</p>
                  <p className="stack-subtitle">SKU: {item.product?.sku || 'N/A'}</p>
                </div>
                <div className="stack-meta">
                  <span className="pill">Qty {item.quantity}</span>
                  <span className="pill ghost">Reorder {item.reorder_level}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Trendline</p>
            <h3 className="section-title">Stock movement</h3>
          </div>
          <p className="meta">Last {summary.stock_trends.length} days</p>
        </div>
        {loading ? (
          <p className="helper">Loading trend data...</p>
        ) : summary.stock_trends.length === 0 ? (
          <p className="helper">No stock movement data yet.</p>
        ) : (
          <div className="trend-chart">
            {summary.stock_trends.map((point) => {
              const height = Math.max(
                6,
                Math.round((point.updates / trendMax) * chartHeight)
              )
              return (
                <div key={point.date} className="trend-item">
                  <div className="trend-bar" style={{ height }} />
                  <span className="trend-value">{point.updates}</span>
                  <span className="trend-label">{formatShortDate(point.date)}</span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Recent Activity</p>
            <h3 className="section-title">Latest stock updates</h3>
          </div>
          <p className="meta">Last {summary.recent_activity.length} updates</p>
        </div>
        {loading ? (
          <p className="helper">Loading activity...</p>
        ) : summary.recent_activity.length === 0 ? (
          <p className="helper">No recent updates.</p>
        ) : (
          <div className="activity-list">
            {summary.recent_activity.map((item) => (
              <div key={item.id} className="activity-row">
                <div>
                  <p className="stack-title">{item.product?.name || 'Product'}</p>
                  <p className="stack-subtitle">Qty {item.quantity}</p>
                </div>
                <p className="activity-time">{formatDate(item.updated_at)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
