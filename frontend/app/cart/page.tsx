import Header from "@/components/header"
import Navigation from "@/components/navigation"
import ShoppingCart from "@/components/shopping-cart"
import ChatbotWidget from "@/components/chatbot-widget"
import Footer from "@/components/footer"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout</p>
        </div>
        <ShoppingCart />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  )
}
