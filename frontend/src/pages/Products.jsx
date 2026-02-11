import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const emptyForm = {
  category_id: '',
  name: '',
  sku: '',
  description: '',
  price: '',
  status: 'active',
  image_url: '',
}

const statusOptions = ['active', 'inactive', 'archived']

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ])
      setProducts(productResponse.data || productResponse)
      setCategories(categoryResponse.data || categoryResponse)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setPreviewUrl('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        price: Number(form.price),
        description: form.description || null,
        image_url: null,
      }
      if (editingId) {
        await api.updateProduct(editingId, payload)
      } else {
        await api.createProduct(payload)
      }
      resetForm()
      await loadProducts()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      category_id: product.category_id?.toString() || '',
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      price: product.price ?? '',
      status: product.status || 'active',
      image_url: product.image_url || '',
    })
    setPreviewUrl('')
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDelete = async (productId) => {
    if (!confirm('Delete this product?')) {
      return
    }
    setError('')
    try {
      await api.deleteProduct(productId)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Products</p>
            <h2 className="section-title">Manage product catalog</h2>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} className="button ghost">
              Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span>Category</span>
            <select
              value={form.category_id}
              onChange={(event) => handleChange('category_id', event.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Name</span>
            <input
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Wireless Headphones"
              required
            />
          </label>
          <label className="field">
            <span>SKU</span>
            <input
              value={form.sku}
              onChange={(event) => handleChange('sku', event.target.value)}
              placeholder="ELEC-HEAD-001"
              required
            />
          </label>
          <label className="field">
            <span>Price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) => handleChange('price', event.target.value)}
              placeholder="129.99"
              required
            />
          </label>
          <label className="field full">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => handleChange('description', event.target.value)}
              placeholder="Short product description"
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => handleChange('status', event.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Product Image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Product preview" />
              <p className="helper">Preview only. Image is not saved.</p>
            </div>
          )}
          <div className="actions full">
            <button type="submit" disabled={saving} className="button primary">
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
          {error && <p className="form-error full">{error}</p>}
        </form>
      </section>

      <section className="section">
        <div className="section-header">
          <h3 className="section-title">Current products</h3>
          <p className="meta">{products.length} total</p>
        </div>
        {loading ? (
          <p className="helper">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="helper">No products yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Inventory</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category?.name || 'Unassigned'}</td>
                    <td className={`status ${product.status}`}>{product.status}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.inventory?.quantity ?? 'N/A'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="button ghost"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="button danger"
                        >
                          Delete
                        </button>
                      </div>
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

export default Products
