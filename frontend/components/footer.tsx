import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Stay in the know</h3>
              <p className="text-blue-100">Get special offers, new product updates, and more.</p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <Input type="email" placeholder="Enter your email" className="rounded-r-none bg-white text-black" />
              <Button className="rounded-l-none bg-yellow-400 hover:bg-yellow-500 text-black">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">*</span>
                </div>
                <span className="font-bold text-xl">Walmart</span>
              </div>
              <p className="text-gray-400 mb-4">
                Save Money. Live Better. America's largest retailer providing everyday low prices.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-white bg-transparent"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-white bg-transparent"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-white bg-transparent"
                >
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-white bg-transparent"
                >
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Get to Know Us */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Get to Know Us</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Careers
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    About Walmart
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Our Company
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Sell on Walmart
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Suppliers
                  </Button>
                </li>
              </ul>
            </div>

            {/* Make Money with Us */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Help Center
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Track Your Order
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Returns & Exchanges
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Contact Us
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Walmart+
                  </Button>
                </li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Shop & Learn</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Store Directory
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Gift Cards
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Walmart Credit Card
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Pharmacy
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Grocery Pickup
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 Walmart Inc. All Rights Reserved.</div>
            <div className="flex space-x-6">
              <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto">
                Privacy Policy
              </Button>
              <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto">
                Terms of Service
              </Button>
              <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto">
                Accessibility
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
