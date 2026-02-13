import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  is_active: true,
}

function Categories({ currentUser }) {
  const canManage = currentUser?.role === 'admin'
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadCategories = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.getCategories()
      setCategories(response.data || response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        description: form.description || null,
      }
      if (editingId) {
        await api.updateCategory(editingId, payload)
      } else {
        await api.createCategory(payload)
      }
      resetForm()
      await loadCategories()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      is_active: Boolean(category.is_active),
    })
  }

  const handleDelete = async (categoryId) => {
    if (!confirm('Delete this category?')) {
      return
    }
    setError('')
    try {
      await api.deleteCategory(categoryId)
      await loadCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Categories</p>
            <h2 className="section-title">Manage catalog categories</h2>
          </div>
          {editingId && canManage && (
            <button type="button" onClick={resetForm} className="button ghost">
              Cancel Edit
            </button>
          )}
        </div>
        {canManage ? (
          <form onSubmit={handleSubmit} className="form-grid">
            <label className="field">
              <span>Name</span>
              <input
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Electronics"
                required
              />
            </label>
            <label className="field">
              <span>Slug</span>
              <input
                value={form.slug}
                onChange={(event) => handleChange('slug', event.target.value)}
                placeholder="electronics"
                required
              />
            </label>
            <label className="field full">
              <span>Description</span>
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                placeholder="Short category description"
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => handleChange('is_active', event.target.checked)}
              />
              Active category
            </label>
            <div className="actions full">
              <button type="submit" disabled={saving} className="button primary">
                {saving ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}
              </button>
            </div>
            {error && <p className="form-error full">{error}</p>}
          </form>
        ) : (
          <p className="helper">Only admins can create or edit categories.</p>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h3 className="section-title">Current categories</h3>
          <p className="meta">{categories.length} total</p>
        </div>
        {loading ? (
          <p className="helper">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="helper">No categories yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>/{category.slug}</td>
                    <td className={category.is_active ? 'status active' : 'status inactive'}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </td>
                    <td>
                      {canManage ? (
                        <div className="table-actions">
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            className="button ghost"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(category.id)}
                            className="button danger"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="helper">Read only</span>
                      )}
                    </td>
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

export default Categories
