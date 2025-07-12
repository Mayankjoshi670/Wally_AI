import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Clock, Shield, Headphones, Gift, CreditCard } from "lucide-react"

const services = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders $35+",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Clock,
    title: "Same-Day Delivery",
    description: "Available in select areas",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Shield,
    title: "Easy Returns",
    description: "90-day return policy",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Customer service available",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Perfect for any occasion",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: CreditCard,
    title: "Walmart+",
    description: "Unlimited free delivery",
    color: "bg-yellow-100 text-yellow-600",
  },
]

export default function ServicesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Shop with Walmart?</h2>
          <p className="text-gray-600">Discover the benefits of shopping with America's favorite retailer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
