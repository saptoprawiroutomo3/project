import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiMapPin, FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi'
import api from '../services/api'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  const [shippingInfo, setShippingInfo] = useState({
    recipientName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingCost = 15000
  const total = subtotal + shippingCost

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: shippingInfo,
        paymentMethod,
        totalAmount: total
      }

      const response = await api.post('/orders', orderData)
      
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${response.data.order._id}`)
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Steps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 1 ? <FiCheck size={16} /> : '1'}
              </div>
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={shippingInfo.recipientName}
                  onChange={(e) => setShippingInfo({...shippingInfo, recipientName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input
                  type="text"
                  value={shippingInfo.province}
                  onChange={(e) => setShippingInfo({...shippingInfo, province: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 2 ? <FiCheck size={16} /> : '2'}
              </div>
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>

            <div className="space-y-3">
              {[
                { id: 'bank_transfer', name: 'Bank Transfer', desc: 'Transfer to our bank account' },
                { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when item is delivered' },
                { id: 'ewallet', name: 'E-Wallet', desc: 'OVO, GoPay, DANA' }
              ].map((method) => (
                <label key={method.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <FiCreditCard className="mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading || !shippingInfo.recipientName || !shippingInfo.address}
            className="w-full mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
