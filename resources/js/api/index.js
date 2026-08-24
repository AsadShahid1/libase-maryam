import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Response Interceptor to auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || ''
      if (url.includes('/admin/') || url.includes('/user/')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Get CSRF cookie before mutating requests
export const getCsrfCookie = () =>
  axios.get('/sanctum/csrf-cookie', { withCredentials: true })

// Auth
export const login = (data) => getCsrfCookie().then(() => api.post('/login', data))
export const register = (data) => getCsrfCookie().then(() => api.post('/register', data))
export const logout = () => api.post('/logout')
export const getUser = () => api.get('/user')

// User
export const getUserDashboard = () => api.get('/user/dashboard')
export const getUserProfile = () => api.get('/user/profile')
export const updateUserProfile = (data) => api.put('/user/profile', data)

// Public Shop
export const getShopProducts = (params = {}) => api.get('/shop', { params })
export const getShopProduct = (id) => api.get(`/shop/products/${id}`)
export const getSearchSuggestions = (q) => api.get('/shop/suggestions', { params: { q } })
export const getShopMetadata = () => api.get('/shop/metadata')
export const submitContactMessage = (data) => api.post('/contact', data)

// Admin Dashboard
export const getAdminDashboard = () => api.get('/admin/dashboard')

// Admin Brands CRUD
export const getAdminBrands = () => api.get('/admin/brands')
export const createBrand = (data) => api.post('/admin/brands', data)
export const updateBrand = (id, data) => api.put(`/admin/brands/${id}`, data)
export const deleteBrand = (id) => api.delete(`/admin/brands/${id}`)

// Admin Categories CRUD
export const getAdminCategories = () => api.get('/admin/categories')
export const createCategory = (data) => api.post('/admin/categories', data)
export const updateCategory = (id, data) => api.put(`/admin/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`)

// Admin Products CRUD (handles variant lists internally)
export const getAdminProducts = () => api.get('/admin/products')
export const createProduct = (data) => api.post('/admin/products', data)
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`)

// Admin Banners CRUD
export const getAdminBanners = () => api.get('/admin/banners')
export const createBanner = (data) => api.post('/admin/banners', data)
export const updateBanner = (id, data) => api.put(`/admin/banners/${id}`, data)
export const deleteBanner = (id) => api.delete(`/admin/banners/${id}`)

// Admin Staff / Administration CRUD
export const getAdminStaff = () => api.get('/admin/administration')
export const createStaffMember = (data) => api.post('/admin/administration', data)
export const updateStaffMember = (id, data) => api.put(`/admin/administration/${id}`, data)
export const deleteStaffMember = (id) => api.delete(`/admin/administration/${id}`)

// Admin Settings (Company Details & Payment gate toggle)
export const getAdminSettings = () => api.get('/admin/settings')
export const updateAdminSettings = (data) => api.post('/admin/settings', data)

// Admin User Manager & Roles
export const getAdminUsers = (page = 1) => api.get(`/admin/users?page=${page}`)
export const createUser = (data) => api.post('/admin/users', data)
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
export const getAdminRoles = () => api.get('/admin/roles')
export const createRole = (data) => api.post('/admin/roles', data)
export const updateRole = (id, data) => api.put(`/admin/roles/${id}`, data)
export const deleteRole = (id) => api.delete(`/admin/roles/${id}`)

// Admin Contact Messages / Inquiries
export const getAdminInquiries = () => api.get('/admin/contacts')
export const toggleInquiryRead = (id) => api.put(`/admin/contacts/${id}`)
export const deleteInquiry = (id) => api.delete(`/admin/contacts/${id}`)

export default api
