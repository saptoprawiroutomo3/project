import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi'
import api from '../services/api'
import toast from 'react-hot-toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data.orders || [])
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" />
      case 'processing': return <FiPackage className="text-blue-500" />
      case 'shipped': return <FiPackage className="text-purple-500" />
      case 'delivered': return <FiCheck className="text-green-500" />
      case 'cancelled': return <FiX className="text-red-500" />
      default: return <FiClock className="text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiEye size={18} />
                  </Link>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} item(s)
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      Rp {order.totalAmount?.toLocaleString('id-ID') || '0'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                        Cancel Order
                      </button>
                    )}
                    <Link
                      to={`/orders/${order._id}`}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
