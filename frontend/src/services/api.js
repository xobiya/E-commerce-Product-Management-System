const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  return response.json()
}

export const api = {
  getCategories() {
    return request('/categories')
  },
  createCategory(payload) {
    return request('/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  updateCategory(id, payload) {
    return request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  deleteCategory(id) {
    return request(`/categories/${id}`, { method: 'DELETE' })
  },
  getProducts() {
    return request('/products')
  },
  createProduct(payload) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  updateProduct(id, payload) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  deleteProduct(id) {
    return request(`/products/${id}`, { method: 'DELETE' })
  },
  getInventories() {
    return request('/inventories')
  },
  createInventory(payload) {
    return request('/inventories', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  updateInventory(id, payload) {
    return request(`/inventories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  deleteInventory(id) {
    return request(`/inventories/${id}`, { method: 'DELETE' })
  },
}
