export function BusinessSEO() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Inter Medi-A",
    "description": "Toko printer, fotocopy, dan komputer terpercaya di Jakarta. Jual printer Canon, Epson, HP, mesin fotocopy, laptop, komputer. Service bergaransi, harga terjangkau.",
    "url": "https://inter-media-app.vercel.app",
    "telephone": "+62-21-12345678",
    "email": "info@intermedia.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Raya Jakarta No. 123",
      "addressLocality": "Jakarta",
      "addressRegion": "DKI Jakarta",
      "postalCode": "12345",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-6.2088",
      "longitude": "106.8456"
    },
    "openingHours": [
      "Mo-Sa 08:00-17:00"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer", "E-Wallet"],
    "currenciesAccepted": "IDR",
    "areaServed": {
      "@type": "City",
      "name": "Jakarta"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "-6.2088",
        "longitude": "106.8456"
      },
      "geoRadius": "50000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Printer & Computer Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Printer Canon, Epson, HP"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Mesin Fotocopy"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product", 
            "name": "Laptop & Komputer"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Service Printer & Fotocopy"
          }
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
