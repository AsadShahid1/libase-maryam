import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { AdminRoute, UserRoute, GuestRoute } from '@/components/RouteGuards'

// Layouts
import AdminLayout from '@/layouts/AdminLayout'
import UserLayout from '@/layouts/UserLayout'

// Auth pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminUsers from '@/pages/admin/Users'
import AdminRoles from '@/pages/admin/Roles'
import AdminBrands from '@/pages/admin/Brands'
import AdminCategories from '@/pages/admin/Categories'
import AdminProducts from '@/pages/admin/Products'
import AdminBanners from '@/pages/admin/Banners'
import AdminAdministration from '@/pages/admin/Administration'
import AdminSettings from '@/pages/admin/Settings'
import AdminContacts from '@/pages/admin/Contacts'

// User pages
import Home from '@/pages/user/Home'
import About from '@/pages/user/About'
import Contact from '@/pages/user/Contact'
import ProductDetail from '@/pages/user/ProductDetail'
import UserDashboard from '@/pages/user/Dashboard'
import Profile from '@/pages/user/Profile'
import Checkout from '@/pages/user/Checkout'
import Categories from '@/pages/user/Categories'
import Products from '@/pages/user/Products'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth routes (redirect if logged in) */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* Admin routes (admin role required) */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="roles" element={<AdminRoles />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="administration" element={<AdminAdministration />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>

            {/* Public Layout and Routes */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* Protected User routes */}
              <Route path="/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
              <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
