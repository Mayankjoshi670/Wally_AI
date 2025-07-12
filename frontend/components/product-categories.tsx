import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Laptop, Home, Baby, Car, Gamepad2, Shirt, Apple, Coffee, Book } from "lucide-react"

const categories = [
  { icon: Smartphone, name: "Electronics", count: "2.5M+ items" },
  { icon: Home, name: "Home & Garden", count: "1.8M+ items" },
  { icon: Shirt, name: "Clothing", count: "3.2M+ items" },
  { icon: Apple, name: "Grocery", count: "500K+ items" },
  { icon: Baby, name: "Baby & Kids", count: "800K+ items" },
  { icon: Car, name: "Auto & Tires", count: "400K+ items" },
  { icon: Gamepad2, name: "Video Games", count: "150K+ items" },
  { icon: Coffee, name: "Kitchen", count: "600K+ items" },
  { icon: Book, name: "Books & Media", count: "300K+ items" },
  { icon: Laptop, name: "Computers", count: "200K+ items" },
]

export default function ProductCategories() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                  <category.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
