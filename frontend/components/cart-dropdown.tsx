"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

interface CartDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart()
  const router = useRouter()

  const handleViewCart = () => {
    router.push("/cart")
    onClose()
  }

  const handleCheckout = () => {
    // For now, just navigate to cart page
    router.push("/cart")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-96 z-50">
        <Card className="shadow-xl border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Shopping Cart</span>
              </div>
              <Badge variant="secondary">{totalItems} items</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {items.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 text-sm mb-4">Add some items to get started!</p>
                <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 border-b last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{item.name}</h4>
                          <p className="text-blue-600 font-semibold">${item.price.toFixed(2)}</p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={handleViewCart} variant="outline" className="w-full bg-transparent">
                      View Cart
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700">
                      Checkout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
