import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productsAPI, reviewsAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiMessageCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState('')

  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const [productRes, reviewsRes] = await Promise.all([
        productsAPI.getProduct(id),
        reviewsAPI.getProductReviews(id, { limit: 5 })
      ])
      
      setProduct(productRes.data.product)
      setRelatedProducts(productRes.data.relatedProducts)
      setReviews(reviewsRes.data.reviews)
    } catch (error) {
      console.error('Failed to fetch product:', error)
      toast.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    const result = await addToCart(product._id, quantity, selectedVariant)
    if (result.success) {
      toast.success('Product added to cart!')
    }
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase')
      return
    }

    await handleAddToCart()
    // Navigate to checkout would go here
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li><Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
          <li><span className="text-gray-400">/</span></li>
          <li><Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
          <li><span className="text-gray-400">/</span></li>
          <li><span className="text-gray-900">{product.name}</span></li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={product.images[selectedImage]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-primary-600 font-medium">
              {product.category?.name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`${
                      i < Math.floor(product.rating?.average || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    size={20}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                ({product.rating?.count || 0} reviews)
              </span>
              <span className="ml-4 text-gray-600">
                {product.totalSold} sold
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-primary-600">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-gray-500 line-through">
                  Rp {product.comparePrice.toLocaleString('id-ID')}
                </span>
              )}
            </div>
            {product.comparePrice && (
              <span className="text-sm text-green-600 font-medium">
                Save Rp {(product.comparePrice - product.price).toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Variants</h3>
              <div className="space-y-3">
                {product.variants.map((variant, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {variant.name}
                    </label>
                    <select
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select {variant.name}</option>
                      {variant.options.map((option, optIndex) => (
                        <option key={optIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-16 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
              <span className="text-sm text-gray-600">
                {product.stock} available
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 btn-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FiShoppingCart className="mr-2" size={20} />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiHeart size={20} />
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiShare2 size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FiTruck className="text-primary-600" size={24} />
              <div>
                <div className="font-medium">Free Shipping</div>
                <div className="text-sm text-gray-600">Orders over Rp 500K</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FiShield className="text-primary-600" size={24} />
              <div>
                <div className="font-medium">Warranty</div>
                <div className="text-sm text-gray-600">1 Year Official</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FiMessageCircle className="text-primary-600" size={24} />
              <div>
                <div className="font-medium">Support</div>
                <div className="text-sm text-gray-600">24/7 Customer Care</div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Seller Information</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">
                  {product.seller?.sellerInfo?.storeName?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <div className="font-medium">
                  {product.seller?.sellerInfo?.storeName || product.seller?.name}
                </div>
                <div className="text-sm text-gray-600">
                  Rating: {product.seller?.sellerInfo?.rating?.toFixed(1) || 'New'} ⭐
                </div>
              </div>
              <button className="ml-auto btn-outline">
                Chat Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-primary-500 py-4 px-1 text-sm font-medium text-primary-600">
              Description
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Specifications
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>
        
        <div className="py-8">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
            
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium">{spec.name}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/products/${relatedProduct._id}`}>
                  <img
                    src={relatedProduct.images[0]?.url || '/placeholder-product.jpg'}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/products/${relatedProduct._id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      Rp {relatedProduct.price.toLocaleString('id-ID')}
                    </span>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 fill-current" size={16} />
                      <span className="text-sm text-gray-600 ml-1">
                        {relatedProduct.rating?.average?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
