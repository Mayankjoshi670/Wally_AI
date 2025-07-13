import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PromoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* School Supplies */}
      <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white overflow-hidden">
        <CardContent className="p-6 relative h-64">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">School supplies up to 50% off</h3>
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              Shop Deals
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <Image
              src="/penci.jpeg?height=200&width=250"
              alt="Crayola Colored Pencils"
              width={180}
              height={100}
              className="rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Deals Banner - Spans 2 columns */}
      <Card className="md:col-span-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
        <CardContent className="p-6 relative h-64">
          <div className="flex items-center justify-between h-full">
            <div className="space-y-4">
              <div className="bg-blue-700 rounded-lg px-4 py-2 inline-block">
                <h2 className="text-2xl font-bold">Walmart</h2>
                <h3 className="text-3xl font-bold">DEALS</h3>
                <p className="text-sm">JULY 8-13 ONLY!</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold">Hurry for up to 30% off!</h4>
                <Button className="mt-2 bg-white text-blue-600 hover:bg-gray-100">Shop Deals</Button>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/kitchen.jpg?height=200&width=300"
                alt="Kitchen Appliances"
                width={340}
                height={200}
                className="rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TVs */}
      <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 text-white overflow-hidden">
        <CardContent className="p-6 relative h-64">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Up to 25% off TVs</h3>
            <Button variant="outline" className="bg-white text-cyan-600 hover:bg-gray-100">
              Shop Deals
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <Image
              src="/Vizio.jpg?height=80&width=120"
              alt="Vizio TV"
              width={180}
              height={80}
              className="rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cooking & Dining */}
      <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white overflow-hidden">
        <CardContent className="p-6 relative h-64">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Cooking & dining up to 40% off</h3>
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              Shop Deals
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <Image
              src="/pot.jpeg?height=100&width=100"
              alt="Instant Pot"
              width={170}
              height={200}
              className="rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Beauty Deals */}
      <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 text-white overflow-hidden">
        <CardContent className="p-6 relative h-64">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">WOW-worthy beauty Deals</h3>
            <Button variant="outline" className="bg-white text-cyan-600 hover:bg-gray-100">
              Shop Deals
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <Image
              src="/dryer.jpg?height=140&width=200"
              alt="Hair Dryer"
              width={140}
              height={130}
              className="rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Toys */}
      <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white overflow-hidden">
        <CardContent className="p-6 relative h-64">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Up to 50% off their fave toys</h3>
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              Shop Deals
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <Image
              src="/lego.jpg?height=80&width=100"
              alt="LEGO Set"
              width={230}
              height={120}
              className="rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Flash Deals */}
      <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-800 overflow-hidden">
        <CardContent className="p-6 relative h-64">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Flash Deals</h3>
            <h4 className="text-lg font-semibold">Up to 65% off</h4>
            <Button className="bg-gray-800 text-white hover:bg-gray-700">Shop now</Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ride-ons & Bikes */}
      <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 text-white overflow-hidden">
        <CardContent className="p-6 relative h-64">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Up to 30% off ride-ons & bikes</h3>
            <Button variant="outline" className="bg-white text-cyan-600 hover:bg-gray-100">
              Shop Deals
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <Image
              src="/placeholder.svg?height=80&width=100"
              alt="Outdoor Toys"
              width={100}
              height={80}
              className="rounded"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
