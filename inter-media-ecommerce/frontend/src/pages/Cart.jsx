import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Cart = () => {
  const { items, total, loading, updateCartItem, removeFromCart, getCartItemCount } = useCart()
  const [updating, setUpdating] = useState({})

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    setUpdating({ ...updating, [itemId]: true })
    await updateCartItem(itemId, newQuantity)
    setUpdating({ ...updating, [itemId]: false })
  }

  const handleRemoveItem = async (itemId) => {
    setUpdating({ ...updating, [itemId]: true })
    await removeFromCart(itemId)
    setUpdating({ ...updating, [itemId]: false })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <FiShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Cart Items ({getCartItemCount()} items)
              </h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                    <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                      <img
                        src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product._id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        Seller: {item.product.seller?.sellerInfo?.storeName || item.product.seller?.name}
                      </p>
                      {item.variant && (
                        <p className="text-sm text-gray-600">
                          Variant: {item.variant}
                        </p>
                      )}
                      <p className="text-lg font-bold text-primary-600 mt-2">
                        Rp {item.product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={updating[item._id] || item.quantity <= 1}
                          className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {updating[item._id] ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={updating[item._id] || item.quantity >= item.product.stock}
                          className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={updating[item._id]}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Rp 15,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">Rp {(total * 0.1).toLocaleString('id-ID')}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    Rp {(total + 15000 + (total * 0.1)).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              
              <Link
                to="/checkout"
                className="w-full btn-primary block text-center"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                to="/products"
                className="w-full btn-secondary block text-center mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
