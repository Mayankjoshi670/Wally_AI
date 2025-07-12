"use client"

import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import ChatbotWidget from "@/components/chatbot-widget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, Heart, MapPin } from "lucide-react"

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const { totalItems, totalPrice } = useCart()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your account</h1>
          <p className="text-gray-600">Sign in to access your orders, saved items, and account settings.</p>
        </main>
        <ChatbotWidget />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Info</CardTitle>
              <User className="h-4 w-4 text-muted-foreground ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Name: {user.name}</p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shopping Cart</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-xs text-muted-foreground">Items in cart</p>
                <p className="text-sm font-medium">${totalPrice.toFixed(2)} total</p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  View Cart
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Heart className="w-4 h-4 mr-2" />
                  Saved Items
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order History
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <MapPin className="w-4 h-4 mr-2" />
                  Addresses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-gray-600">Sign out of your Walmart account</p>
              </div>
              <Button variant="destructive" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <ChatbotWidget />
    </div>
  )
}
