import { createContext, useContext, useReducer, useEffect } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext()

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
        loading: false,
      }
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
      }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      }
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartAPI.getCart()
      dispatch({ type: 'SET_CART', payload: response.data })
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      console.error('Failed to fetch cart:', error)
    }
  }

  const addToCart = async (productId, quantity = 1, variant = '') => {
    try {
      const response = await cartAPI.addToCart({ productId, quantity, variant })
      const cartData = calculateCartTotals(response.data.cart.items)
      dispatch({ type: 'ADD_ITEM', payload: cartData })
      toast.success('Product added to cart!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, { quantity })
      const cartData = calculateCartTotals(response.data.cart.items)
      dispatch({ type: 'UPDATE_ITEM', payload: cartData })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart'
      toast.error(message)
      return { success: false }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.removeFromCart(itemId)
      const cartData = calculateCartTotals(response.data.cart.items)
      dispatch({ type: 'REMOVE_ITEM', payload: cartData })
      toast.success('Item removed from cart')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item'
      toast.error(message)
      return { success: false }
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clearCart()
      dispatch({ type: 'CLEAR_CART' })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart'
      toast.error(message)
      return { success: false }
    }
  }

  const calculateCartTotals = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    
    return {
      items,
      total,
      itemCount: items.length
    }
  }

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
