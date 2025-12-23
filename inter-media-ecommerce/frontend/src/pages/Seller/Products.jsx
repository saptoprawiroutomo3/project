import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiPackage, FiSearch } from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

const SellerProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: []
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/seller/products')
      setProducts(response.data.products || [])
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(`/seller/products/${editingProduct._id}`, formData)
        toast.success('Product updated successfully')
      } else {
        await api.post('/seller/products', formData)
        toast.success('Product created successfully')
      }
      
      setShowAddModal(false)
      setEditingProduct(null)
      setFormData({ name: '', description: '', price: '', stock: '', category: '', images: [] })
      fetchProducts()
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    try {
      await api.delete(`/seller/products/${productId}`)
      setProducts(products.filter(p => p._id !== productId))
      toast.success('Product deleted successfully')
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category?._id || '',
      images: product.images || []
    })
    setShowAddModal(true)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <FiPlus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Start by adding your first product.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FiPlus size={16} />
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiPackage size={48} className="text-gray-400" />
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-red-600">
                    Rp {product.price?.toLocaleString('id-ID')}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingProduct(null)
                      setFormData({ name: '', description: '', price: '', stock: '', category: '', images: [] })
                    }}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerProducts
