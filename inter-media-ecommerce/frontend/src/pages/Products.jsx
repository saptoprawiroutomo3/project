import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { productsAPI, categoriesAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useDebounce } from '../hooks/useCommon'
import { FiGrid, FiList, FiFilter, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import Pagination from '../components/UI/Pagination'
import toast from 'react-hot-toast'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    // Get filters from URL params
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page')) || 1

    setFilters({ category, minPrice, maxPrice, sortBy, sortOrder })
    setSearchTerm(search)
    setCurrentPage(page)
    
    fetchProducts({ category, search, minPrice, maxPrice, sortBy, sortOrder, page })
    fetchCategories()
  }, [searchParams])

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return
    
    const newFilters = { ...filters, search: debouncedSearchTerm, page: 1 }
    updateUrlParams(newFilters)
  }, [debouncedSearchTerm])

  const fetchProducts = async (filterParams = filters) => {
    try {
      setLoading(true)
      const response = await productsAPI.getProducts(filterParams)
      setProducts(response.data.products)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const updateUrlParams = (newFilters) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    setCurrentPage(1)
    updateUrlParams(newFilters)
  }

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page }
    setCurrentPage(page)
    updateUrlParams(newFilters)
  }

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1)
    if (result.success) {
      toast.success('Product added to cart!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiFilter className="mr-2" />
              Filters
            </h3>

            {/* Search */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Search</h4>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">All Categories</span>
                </label>
                {categories.map((category) => (
                  <label key={category._id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category._id}
                      checked={filters.category === category._id}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Sort By</h4>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  handleFilterChange('sortBy', sortBy)
                  handleFilterChange('sortOrder', sortOrder)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">
                {pagination.totalProducts} products found
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {products.map((product) => (
                  <div key={product._id} className={viewMode === 'grid' 
                    ? 'bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow'
                    : 'bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow'
                  }>
                    <Link to={`/products/${product._id}`} className={viewMode === 'grid' ? 'block' : 'flex-shrink-0'}>
                      <img
                        src={product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className={viewMode === 'grid' 
                          ? 'w-full h-48 object-cover'
                          : 'w-24 h-24 object-cover rounded-lg'
                        }
                      />
                    </Link>
                    
                    <div className={viewMode === 'grid' ? 'p-4' : 'flex-1'}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.category?.name}
                        </span>
                        <div className="flex items-center">
                          <FiStar className="text-yellow-400 fill-current" size={14} />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating?.average?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </div>
                      
                      <Link to={`/products/${product._id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary-600">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              Rp {product.comparePrice.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <FiHeart size={18} />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product._id)}
                            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg transition-colors"
                          >
                            <FiShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalProducts}
                    itemsPerPage={12}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
