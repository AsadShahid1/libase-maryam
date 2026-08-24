import './index.css'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import { CartProvider } from '@/contexts/CartContext'

createInertiaApp({
  title: (title) => title ? `${title} — Libas-E-Maryam` : 'Libas-E-Maryam',
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.jsx`,
      import.meta.glob('./pages/**/*.jsx'),
    ),
  setup({ el, App, props }) {
    createRoot(el).render(
      <CartProvider>
        <App {...props} />
      </CartProvider>
    )
  },
  progress: {
    color: '#d4af37',
  },
})
