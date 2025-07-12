"use client"

import { useState } from "react"
import { Search, MapPin, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import AuthDialog from "@/components/auth-dialog"
import CartDropdown from "@/components/cart-dropdown"
import { useCart } from "@/contexts/cart-context"

export default function Header() {
  const { totalItems, totalPrice } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Pickup/Delivery */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">*</span>
              </div>
              <span className="font-bold text-xl hidden sm:block">Walmart</span>
            </div>

            <div className="hidden md:flex items-center space-x-2 bg-blue-700 rounded-full px-4 py-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Pickup or delivery?</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search everything at Walmart online and in store"
                className="w-full pl-4 pr-12 py-2 rounded-full border-0 text-black"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:flex items-center space-x-1 text-white hover:bg-blue-700">
              <span className="text-sm">Reorder</span>
            </Button>

            <AuthDialog />

            {/* Cart Button with Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-1 text-white hover:bg-blue-700"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                      {totalItems}
                    </Badge>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs">My Items</div>
                  <div className="text-xs font-semibold">${totalPrice.toFixed(2)}</div>
                </div>
              </Button>

              <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
