"use client"

import { ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  "Get it Fast",
  "New Arrivals",
  "Deals",
  "Dinner Made Easy",
  "Pharmacy Delivery",
  "Trending",
  "Back to School",
  "My Items",
  "Auto Service",
  "Only at Walmart",
  "Registry",
  "Walmart+",
]

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-12 space-x-6">
          <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:bg-gray-100">
            <Menu className="w-4 h-4" />
            <span className="font-medium">Departments</span>
            <ChevronDown className="w-4 h-4" />
          </Button>

          <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:bg-gray-100">
            <span className="font-medium">Services</span>
            <ChevronDown className="w-4 h-4" />
          </Button>

          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button key={item} variant="ghost" className="text-sm text-gray-700 hover:bg-gray-100 px-2">
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
