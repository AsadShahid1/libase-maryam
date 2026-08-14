import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('libase_cart')
    return saved ? JSON.parse(saved) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('libase_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, selectedSize = 'M', selectedColor = 'Champagne Gold') => {
    const cartLineId = `${product.id}-${selectedSize}-${selectedColor}`
    setCartItems(prev => {
      const existing = prev.find(item => item.cartLineId === cartLineId)
      if (existing) {
        return prev.map(item =>
          item.cartLineId === cartLineId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, {
        ...product,
        cartLineId,
        selectedSize,
        selectedColor,
        quantity: 1
      }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (cartLineId) => {
    setCartItems(prev => prev.filter(item => item.cartLineId !== cartLineId))
  }

  const updateQuantity = (cartLineId, amount) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.cartLineId === cartLineId) {
          const newQty = item.quantity + amount
          return newQty > 0 ? { ...item, quantity: newQty } : item
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
