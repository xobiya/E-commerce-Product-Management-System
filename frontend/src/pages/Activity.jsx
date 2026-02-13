import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const emptyFilters = {
  entity_type: '',
  action: '',
}

function Activity({ currentUser }) {
  const canView = currentUser?.role === 'admin'
  const [logs, setLogs] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLogs = async (params = filters) => {
    setLoading(true)
    setError('')
    try {
      const response = await api.getAuditLogs(params)
      setLogs(response.data || response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (canView) {
      loadLogs()
    }
  }, [canView])

  if (!canView) {
    return (
      <div className="page">
        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Activity</p>
              <h2 className="section-title">Audit log</h2>
            </div>
          </div>
          <p className="helper">Only admins can access the audit log.</p>
        </section>
      </div>
    )
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilterSubmit = async (event) => {
    event.preventDefault()
    await loadLogs(filters)
  }

  const handleFilterReset = async () => {
    setFilters(emptyFilters)
    await loadLogs(emptyFilters)
  }

  const formatDate = (value) => {
    if (!value) return 'N/A'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.valueOf())) return 'N/A'
    return parsed.toLocaleString()
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Activity</p>
            <h2 className="section-title">Audit log</h2>
          </div>
          <button type="button" className="button ghost" onClick={loadLogs}>
            Refresh
          </button>
        </div>
        <form className="filter-grid" onSubmit={handleFilterSubmit}>
          <label className="field">
            <span>Entity</span>
            <select
              value={filters.entity_type}
              onChange={(event) => handleFilterChange('entity_type', event.target.value)}
            >
              <option value="">All entities</option>
              <option value="Product">Product</option>
              <option value="Category">Category</option>
              <option value="Inventory">Inventory</option>
            </select>
          </label>
          <label className="field">
            <span>Action</span>
            <select
              value={filters.action}
              onChange={(event) => handleFilterChange('action', event.target.value)}
            >
              <option value="">All actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
          </label>
          <div className="actions">
            <button type="submit" className="button">
              Apply Filters
            </button>
            <button type="button" onClick={handleFilterReset} className="button ghost">
              Clear
            </button>
          </div>
        </form>
        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="section">
        <div className="section-header">
          <h3 className="section-title">Recent changes</h3>
          <p className="meta">{logs.length} entries</p>
        </div>
        {loading ? (
          <p className="helper">Loading audit log...</p>
        ) : logs.length === 0 ? (
          <p className="helper">No audit logs yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Entity</th>
                  <th>Action</th>
                  <th>Record</th>
                  <th>Actor</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDate(log.created_at)}</td>
                    <td>{log.entity_type}</td>
                    <td>
                      <span className="pill ghost">{log.action}</span>
                    </td>
                    <td>#{log.entity_id}</td>
                    <td>{log.user?.name || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Activity
