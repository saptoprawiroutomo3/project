#!/bin/bash

# Create SEO Images for Inter Media App
echo "🎨 Creating SEO Images for Inter Media..."

# Create placeholder images using ImageMagick (if available) or simple text files
cd public

# Main OG Image (1200x630)
echo "📸 Creating og-image.jpg..."
cat > og-image-info.txt << 'EOF'
OG Image Placeholder (1200x630px)
Title: Inter Medi-A - Toko Printer & Komputer Terpercaya
Description: Jual printer Canon, Epson, HP, mesin fotocopy, laptop, komputer di Jakarta
Colors: Blue (#0066CC), White (#FFFFFF), Gray (#333333)
Logo: Inter Medi-A logo centered
Background: Professional gradient blue
EOF

# Products OG Image
echo "📸 Creating products-og.jpg..."
cat > products-og-info.txt << 'EOF'
Products OG Image (1200x630px)
Title: Produk Printer & Komputer - Inter Medi-A
Description: 105+ produk printer, fotocopy, laptop, komputer terlengkap
Show: Product collage with Canon, Epson, HP logos
EOF

# Service OG Image
echo "📸 Creating service-og.jpg..."
cat > service-og-info.txt << 'EOF'
Service OG Image (1200x630px)
Title: Service Printer & Fotocopy - Inter Medi-A
Description: Service bergaransi, teknisi berpengalaman, spare part original
Show: Technician working on printer
EOF

# About OG Image
echo "📸 Creating about-og.jpg..."
cat > about-og-info.txt << 'EOF'
About OG Image (1200x630px)
Title: Tentang Inter Medi-A
Description: Toko printer & komputer terpercaya sejak 2020
Show: Store front or team photo
EOF

# Contact OG Image
echo "📸 Creating contact-og.jpg..."
cat > contact-og-info.txt << 'EOF'
Contact OG Image (1200x630px)
Title: Hubungi Inter Medi-A
Description: Jl. Raya Jakarta, Telp: +62-21-12345678
Show: Map location and contact info
EOF

# Create simple placeholder images using convert (if ImageMagick available)
if command -v convert &> /dev/null; then
    echo "🎨 ImageMagick found, creating actual images..."
    
    # Main OG Image
    convert -size 1200x630 xc:'#0066CC' \
        -font Arial -pointsize 48 -fill white -gravity center \
        -annotate +0-100 'Inter Medi-A' \
        -pointsize 24 -annotate +0-50 'Toko Printer & Komputer Terpercaya' \
        -pointsize 18 -annotate +0+50 'Jual Printer Canon, Epson, HP | Service Bergaransi' \
        og-image.jpg
    
    # Products Image
    convert -size 1200x630 xc:'#00AA44' \
        -font Arial -pointsize 48 -fill white -gravity center \
        -annotate +0-50 'Produk Lengkap' \
        -pointsize 24 -annotate +0+50 '105+ Printer, Fotocopy, Laptop' \
        products-og.jpg
    
    # Service Image
    convert -size 1200x630 xc:'#FF6600' \
        -font Arial -pointsize 48 -fill white -gravity center \
        -annotate +0-50 'Service Terpercaya' \
        -pointsize 24 -annotate +0+50 'Teknisi Berpengalaman | Garansi Resmi' \
        service-og.jpg
    
    # About Image
    convert -size 1200x630 xc:'#6600CC' \
        -font Arial -pointsize 48 -fill white -gravity center \
        -annotate +0-50 'Tentang Kami' \
        -pointsize 24 -annotate +0+50 'Terpercaya Sejak 2020' \
        about-og.jpg
    
    # Contact Image
    convert -size 1200x630 xc:'#CC0066' \
        -font Arial -pointsize 48 -fill white -gravity center \
        -annotate +0-50 'Hubungi Kami' \
        -pointsize 24 -annotate +0+50 'Jakarta | +62-21-12345678' \
        contact-og.jpg
    
    echo "✅ SEO images created successfully!"
else
    echo "⚠️  ImageMagick not found. Please create these images manually:"
    echo "   - og-image.jpg (1200x630px)"
    echo "   - products-og.jpg (1200x630px)"
    echo "   - service-og.jpg (1200x630px)"
    echo "   - about-og.jpg (1200x630px)"
    echo "   - contact-og.jpg (1200x630px)"
    echo ""
    echo "📝 Image specifications saved as *-info.txt files"
fi

echo ""
echo "🎯 SEO Images Setup Complete!"
echo "📁 Location: /public/"
echo "🔗 Usage: These images will be used for social media sharing"
