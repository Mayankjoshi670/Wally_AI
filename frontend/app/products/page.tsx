import Header from "@/components/header"
import Navigation from "@/components/navigation"
import ProductGrid from "@/components/product-grid"
import ChatbotWidget from "@/components/chatbot-widget"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-600">Discover amazing deals on everything you need</p>
        </div>
        <ProductGrid />
      </main>
      <ChatbotWidget />
    </div>
  )
}
