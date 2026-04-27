import React, { createContext, useState, useContext } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  )
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {}
  )
  const [paymentMethod, setPaymentMethod] = useState('Mock Payment')

  const saveItem = (items) => {
    setCartItems(items)
    localStorage.setItem('cartItems', JSON.stringify(items))
  }

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((x) => x._id === product._id)
      let updated
      if (exists) {
        updated = prev.map((x) =>
          x._id === product._id ? { ...x, qty: Math.min(x.qty + qty, product.countInStock) } : x
        )
      } else {
        updated = [...prev, { ...product, qty }]
      }
      localStorage.setItem('cartItems', JSON.stringify(updated))
      return updated
    })
  }

  const updateQty = (id, qty) => {
    setCartItems((prev) => {
      const updated = prev.map((x) => x._id === id ? { ...x, qty } : x)
      localStorage.setItem('cartItems', JSON.stringify(updated))
      return updated
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((x) => x._id !== id)
      localStorage.setItem('cartItems', JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cartItems')
  }

  const saveShippingAddress = (data) => {
    setShippingAddress(data)
    localStorage.setItem('shippingAddress', JSON.stringify(data))
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const shippingPrice = itemsPrice > 100 ? 0 : 9.99
  const taxPrice = +(itemsPrice * 0.15).toFixed(2)
  const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2)

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty, clearCart,
      shippingAddress, saveShippingAddress,
      paymentMethod, setPaymentMethod,
      totalItems, itemsPrice, shippingPrice, taxPrice, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)