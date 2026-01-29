import { Product } from '@/types'

interface ProductSEOProps {
  product: Product
}

export function ProductSEO({ product }: ProductSEOProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inter-media-app.vercel.app'
  
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Inter Medi-A"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/products/${product._id}`,
      "priceCurrency": "IDR",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Inter Medi-A"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "127"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
