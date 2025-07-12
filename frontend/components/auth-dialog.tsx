"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { User, Loader2, Phone, Mail, Eye, EyeOff, ShoppingCart, Star, Shield, Heart } from "lucide-react"

export default function AuthDialog() {
  const { user, signIn, signUp, signOut, isLoading } = useAuth()
  const [open, setOpen] = useState(false)
  const [signInForm, setSignInForm] = useState({ emailOrPhone: "", password: "" })
  const [signUpForm, setSignUpForm] = useState({ email: "", password: "", name: "", phone: "" })
  const [error, setError] = useState("")
  const [signInMethod, setSignInMethod] = useState<"email" | "phone">("email")
  const [showPassword, setShowPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, "")
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else {
      return phoneNumber
    }
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneDigits = phone.replace(/\D/g, "")
    return phoneDigits.length === 10
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { emailOrPhone, password } = signInForm

    if (signInMethod === "email" && !validateEmail(emailOrPhone)) {
      setError("Please enter a valid email address")
      return
    }

    if (signInMethod === "phone" && !validatePhone(emailOrPhone)) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    const success = await signIn(emailOrPhone, password)
    if (success) {
      setOpen(false)
      setSignInForm({ emailOrPhone: "", password: "" })
    } else {
      setError("Invalid credentials. Please try again.")
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { email, password, name, phone } = signUpForm

    if (!name.trim()) {
      setError("Please enter your full name")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    const success = await signUp(email, password, name, phone)
    if (success) {
      setOpen(false)
      setSignUpForm({ email: "", password: "", name: "", phone: "" })
    } else {
      setError("Registration failed. Please try again.")
    }
  }

  const handlePhoneInput = (value: string, field: "signIn" | "signUp") => {
    const formatted = formatPhoneNumber(value)
    if (field === "signIn") {
      setSignInForm((prev) => ({ ...prev, emailOrPhone: formatted }))
    } else {
      setSignUpForm((prev) => ({ ...prev, phone: formatted }))
    }
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" className="flex items-center space-x-1 text-white hover:bg-blue-700">
          <User className="w-4 h-4" />
          <div className="hidden sm:block text-left">
            <div className="text-xs">Welcome</div>
            <div className="text-xs font-semibold">{user.name}</div>
          </div>
        </Button>
        <Button variant="ghost" onClick={signOut} className="text-white hover:bg-blue-700 text-xs">
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-1 text-white hover:bg-blue-700">
          <User className="w-4 h-4" />
          <div className="hidden sm:block text-left">
            <div className="text-xs">Sign In</div>
            <div className="text-xs font-semibold">Account</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white">
        <div className="flex min-h-[600px]">
          {/* Left Side - Branding */}
          <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-2xl">*</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Walmart</h1>
                  <p className="text-blue-100">Save Money. Live Better.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Millions of Products</h3>
                    <p className="text-blue-200 text-sm">Everything you need, all in one place</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Best Prices</h3>
                    <p className="text-blue-200 text-sm">Everyday low prices guaranteed</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure Shopping</h3>
                    <p className="text-blue-200 text-sm">Your data is safe and protected</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="bg-blue-500 bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">Customer Favorite</span>
                </div>
                <p className="text-sm text-blue-100">
                  "Best shopping experience ever! Fast delivery and amazing prices."
                </p>
                <p className="text-xs text-blue-200 mt-2">- Sarah M., Verified Customer</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-8">
            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">Welcome to Your Account</DialogTitle>
              <p className="text-gray-600 mt-2">Sign in to access exclusive deals and faster checkout</p>
            </DialogHeader>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger value="signin" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Create Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6">
                {/* Sign In Method Toggle */}
                <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl">
                  <Button
                    type="button"
                    variant={signInMethod === "email" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSignInMethod("email")
                      setSignInForm((prev) => ({ ...prev, emailOrPhone: "" }))
                      setError("")
                    }}
                    className={`flex-1 text-sm rounded-lg ${
                      signInMethod === "email" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-200"
                    }`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={signInMethod === "phone" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSignInMethod("phone")
                      setSignInForm((prev) => ({ ...prev, emailOrPhone: "" }))
                      setError("")
                    }}
                    className={`flex-1 text-sm rounded-lg ${
                      signInMethod === "phone" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-200"
                    }`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </Button>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-credential" className="text-sm font-medium text-gray-700">
                      {signInMethod === "email" ? "Email Address" : "Phone Number"}
                    </Label>
                    <Input
                      id="signin-credential"
                      type={signInMethod === "email" ? "email" : "tel"}
                      placeholder={signInMethod === "email" ? "Enter your email" : "(555) 123-4567"}
                      value={signInForm.emailOrPhone}
                      onChange={(e) => {
                        if (signInMethod === "phone") {
                          handlePhoneInput(e.target.value, "signIn")
                        } else {
                          setSignInForm((prev) => ({ ...prev, emailOrPhone: e.target.value }))
                        }
                      }}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm((prev) => ({ ...prev, password: e.target.value }))}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="text-center">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm">
                      Forgot your password?
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpForm.name}
                        onChange={(e) => setSignUpForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={signUpForm.phone}
                        onChange={(e) => handlePhoneInput(e.target.value, "signUp")}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showSignUpPassword ? "text" : "password"}
                          placeholder="Create a password (min. 6 characters)"
                          value={signUpForm.password}
                          onChange={(e) => setSignUpForm((prev) => ({ ...prev, password: e.target.value }))}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        >
                          {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-xs text-gray-500 mt-6 border-t pt-4">
              By signing in or creating an account, you agree to Walmart's{" "}
              <Button variant="link" className="text-blue-600 p-0 h-auto text-xs">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button variant="link" className="text-blue-600 p-0 h-auto text-xs">
                Privacy Policy
              </Button>
              .
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
