const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

function getAuthToken() {
  return localStorage.getItem('auth_token')
}

function toQuery(params = {}) {
  const entries = Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  if (entries.length === 0) {
    return ''
  }
  const query = new URLSearchParams(entries)
  return `?${query.toString()}`
}

async function request(path, options = {}) {
  const token = getAuthToken()
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    throw new Error(`Network error. ${message}`)
  }

  if (!response.ok) {
    let message = 'Request failed'
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await response.json()
      message = data.message || data.error || message
    } else {
      const text = await response.text()
      message = text || message
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  login(payload) {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  logout() {
    return request('/logout', { method: 'POST' })
  },
  getCurrentUser() {
    return request('/me')
  },
  updateProfile(payload) {
    return request('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  updatePassword(payload) {
    return request('/profile/password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
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
  getProducts(params) {
    return request(`/products${toQuery(params)}`)
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
  getInventories(params) {
    return request(`/inventories${toQuery(params)}`)
  },
  getAuditLogs(params) {
    return request(`/audit-logs${toQuery(params)}`)
  },
  getDashboardSummary() {
    return request('/dashboard')
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
