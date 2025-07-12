import Header from "@/components/header"
import PromoGrid from "@/components/promo-grid"
import Navigation from "@/components/navigation"
import ChatbotWidget from "@/components/chatbot-widget"
import ProductCategories from "@/components/product-categories"
import FeaturedProducts from "@/components/featured-products"
import ServicesSection from "@/components/services-section"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navigation />
      <main>
        <div className="container mx-auto px-4 py-6">
          <PromoGrid />
        </div>
        <ProductCategories />
        <FeaturedProducts />
        <ServicesSection />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  )
}
