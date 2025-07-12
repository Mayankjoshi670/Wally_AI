"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

export default function ShoppingCart() {
  const { items: cartItems, updateQuantity, removeItem, totalPrice } = useCart()
  const router = useRouter()

  const subtotal = totalPrice
  const tax = subtotal * 0.08
  const shipping = subtotal > 35 ? 0 : 5.99
  const total = subtotal + tax + shipping

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
        <div className="space-y-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
          <div className="text-sm text-gray-500">
            <p>Need help finding products? Try browsing our categories or use the search bar.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Shopping Cart</span>
              <Badge variant="secondary">{cartItems.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center space-x-4 py-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">In Stock</p>
                    <p className="text-xl font-bold text-blue-600">${item.price.toFixed(2)}</p>

                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                          className="w-16 text-center h-8"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
                {index < cartItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Continue Shopping */}
        <div className="mt-6">
          <Button variant="outline" onClick={() => router.push("/")} className="bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500">Add ${(35 - subtotal).toFixed(2)} more for FREE shipping</p>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full bg-transparent h-12">
                Save for Later
              </Button>
            </div>

            {/* Security Badge */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500 mb-2">Secure Checkout</p>
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">MC</div>
                <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center">
                  AMEX
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
