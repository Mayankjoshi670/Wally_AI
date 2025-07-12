"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import CartNotification from "@/components/cart-notification"

const featuredProducts = [
  {
    id: 101,
    name: "Apple iPhone 15 Pro Max 256GB",
    price: 1199.99,
    originalPrice: 1299.99,
    rating: 4.8,
    reviews: 2847,
    image: "/placeholder.svg?height=250&width=250",
    badge: "Best Seller",
    category: "Electronics",
  },
  {
    id: 102,
    name: 'Samsung 75" 4K Neo QLED Smart TV',
    price: 1599.99,
    originalPrice: 1999.99,
    rating: 4.7,
    reviews: 1523,
    image: "/placeholder.svg?height=250&width=250",
    badge: "20% Off",
    category: "Electronics",
  },
  {
    id: 103,
    name: "PlayStation 5 Console Bundle",
    price: 499.99,
    originalPrice: 599.99,
    rating: 4.9,
    reviews: 3421,
    image: "/placeholder.svg?height=250&width=250",
    badge: "Limited Stock",
    category: "Gaming",
  },
  {
    id: 104,
    name: "Dyson V15 Detect Absolute Vacuum",
    price: 649.99,
    originalPrice: 749.99,
    rating: 4.6,
    reviews: 892,
    image: "/placeholder.svg?height=250&width=250",
    badge: "Save $100",
    category: "Home",
  },
  {
    id: 105,
    name: "KitchenAid Artisan Stand Mixer",
    price: 279.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviews: 2156,
    image: "/placeholder.svg?height=250&width=250",
    badge: "20% Off",
    category: "Kitchen",
  },
  {
    id: 106,
    name: "Apple AirPods Pro (3rd Generation)",
    price: 249.99,
    originalPrice: 279.99,
    rating: 4.9,
    reviews: 4567,
    image: "/placeholder.svg?height=250&width=250",
    badge: "New Arrival",
    category: "Electronics",
  },
  {
    id: 107,
    name: "Nike Air Force 1 Low Sneakers",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.7,
    reviews: 1234,
    image: "/placeholder.svg?height=250&width=250",
    badge: "25% Off",
    category: "Fashion",
  },
  {
    id: 108,
    name: "Instant Pot Duo 7-in-1 Pressure Cooker",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 5689,
    image: "/placeholder.svg?height=250&width=250",
    badge: "38% Off",
    category: "Kitchen",
  },
]

export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const [notification, setNotification] = useState({ show: false, productName: "" })

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setNotification({ show: true, productName: product.name })
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Button variant="outline" className="bg-transparent">
            View All Products
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="p-4">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={250}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">{product.badge}</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-100"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>

                  <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviews.toLocaleString()})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CartNotification
        show={notification.show}
        productName={notification.productName}
        onClose={() => setNotification({ show: false, productName: "" })}
      />
    </section>
  )
}
