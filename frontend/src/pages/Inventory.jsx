import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const emptyForm = {
  product_id: '',
  quantity: '',
  reorder_level: '',
}

function Inventory() {
  const [inventories, setInventories] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadInventories = async () => {
    setLoading(true)
    setError('')
    try {
      const [inventoryResponse, productResponse] = await Promise.all([
        api.getInventories(),
        api.getProducts(),
      ])
      setInventories(inventoryResponse.data || inventoryResponse)
      setProducts(productResponse.data || productResponse)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventories()
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
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        reorder_level: form.reorder_level === '' ? 0 : Number(form.reorder_level),
      }
      if (editingId) {
        await api.updateInventory(editingId, payload)
      } else {
        await api.createInventory(payload)
      }
      resetForm()
      await loadInventories()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (inventory) => {
    setEditingId(inventory.id)
    setForm({
      product_id: inventory.product_id?.toString() || '',
      quantity: inventory.quantity ?? '',
      reorder_level: inventory.reorder_level ?? '',
    })
  }

  const handleDelete = async (inventoryId) => {
    if (!confirm('Delete this inventory record?')) {
      return
    }
    setError('')
    try {
      await api.deleteInventory(inventoryId)
      await loadInventories()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2 className="section-title">Track stock levels</h2>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} className="button ghost">
              Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span>Product</span>
            <select
              value={form.product_id}
              onChange={(event) => handleChange('product_id', event.target.value)}
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Quantity</span>
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(event) => handleChange('quantity', event.target.value)}
              placeholder="24"
              required
            />
          </label>
          <label className="field">
            <span>Reorder Level</span>
            <input
              type="number"
              min="0"
              value={form.reorder_level}
              onChange={(event) => handleChange('reorder_level', event.target.value)}
              placeholder="5"
            />
          </label>
          <div className="actions full">
            <button type="submit" disabled={saving} className="button primary">
              {saving ? 'Saving...' : editingId ? 'Update Inventory' : 'Add Inventory'}
            </button>
          </div>
          {error && <p className="form-error full">{error}</p>}
        </form>
      </section>

      <section className="section">
        <div className="section-header">
          <h3 className="section-title">Stock overview</h3>
          <p className="meta">{inventories.length} records</p>
        </div>
        {loading ? (
          <p className="helper">Loading inventory...</p>
        ) : inventories.length === 0 ? (
          <p className="helper">No inventory records yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Reorder Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventories.map((inventory) => (
                  <tr key={inventory.id}>
                    <td>{inventory.product?.name || 'Product'}</td>
                    <td>{inventory.product?.sku || 'N/A'}</td>
                    <td>{inventory.quantity}</td>
                    <td>{inventory.reorder_level}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(inventory)}
                          className="button ghost"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(inventory.id)}
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

export default Inventory
