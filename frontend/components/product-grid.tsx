"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import CartNotification from "@/components/cart-notification"

const products = [
  {
    id: 1,
    name: "Apple iPhone 15 Pro Max",
    price: 1199.0,
    originalPrice: 1299.0,
    rating: 4.8,
    reviews: 2847,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: 'Samsung 65" 4K Smart TV',
    price: 599.99,
    originalPrice: 799.99,
    rating: 4.6,
    reviews: 1523,
    image: "/placeholder.svg?height=200&width=200",
    badge: "25% Off",
  },
  {
    id: 3,
    name: "Nintendo Switch OLED",
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 3421,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Limited Time",
  },
  {
    id: 4,
    name: "Dyson V15 Detect Vacuum",
    price: 649.99,
    originalPrice: 749.99,
    rating: 4.7,
    reviews: 892,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Save $100",
  },
  {
    id: 5,
    name: "KitchenAid Stand Mixer",
    price: 279.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviews: 2156,
    image: "/placeholder.svg?height=200&width=200",
    badge: "20% Off",
  },
  {
    id: 6,
    name: "Apple AirPods Pro (2nd Gen)",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviews: 4567,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Hot Deal",
  },
]

export default function ProductGrid() {
  const { addToCart } = useCart()
  const [notification, setNotification] = useState({ show: false, productName: "" })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
              {product.badge && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {product.badge}
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 text-gray-900">{product.name}</h3>

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
                <span className="text-xs text-gray-600">({product.reviews})</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  })
                  setNotification({ show: true, productName: product.name })
                }}
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <CartNotification
        show={notification.show}
        productName={notification.productName}
        onClose={() => setNotification({ show: false, productName: "" })}
      />
    </div>
  )
}
