"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PhoneTest() {
  const [phoneInput, setPhoneInput] = useState("")
  const [formattedPhone, setFormattedPhone] = useState("")
  const [normalizedPhone, setNormalizedPhone] = useState("")

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, "")
    
    // If it starts with 91, treat as country code
    if (phoneNumber.startsWith("91") && phoneNumber.length >= 12) {
      return `+91 ${phoneNumber.slice(2, 7)} ${phoneNumber.slice(7, 10)} ${phoneNumber.slice(10)}`
    }
    
    // If it's 10 digits, add +91 prefix
    if (phoneNumber.length === 10) {
      return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8)}`
    }
    
    // If it's less than 10 digits, format as user types
    if (phoneNumber.length <= 10) {
      if (phoneNumber.length >= 6) {
        return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8)}`
      } else if (phoneNumber.length >= 3) {
        return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`
      } else {
        return `+91 ${phoneNumber}`
      }
    }
    
    return `+91 ${phoneNumber}`
  }

  const normalizePhoneNumber = (phone: string) => {
    const phoneDigits = phone.replace(/\D/g, "")
    // If it's 10 digits, add +91 prefix
    if (phoneDigits.length === 10) {
      return `+91${phoneDigits}`
    }
    // If it's 12 digits with 91 prefix, add + sign
    if (phoneDigits.length === 12 && phoneDigits.startsWith("91")) {
      return `+${phoneDigits}`
    }
    // If it already has +91, return as is
    if (phone.startsWith("+91")) {
      return phone
    }
    // Default fallback
    return `+91${phoneDigits}`
  }

  const validatePhone = (phone: string) => {
    const phoneDigits = phone.replace(/\D/g, "")
    // Accept 10 digits (Indian format) or 12 digits (with 91 country code)
    return phoneDigits.length === 10 || (phoneDigits.length === 12 && phoneDigits.startsWith("91"))
  }

  const handleTest = () => {
    const formatted = formatPhoneNumber(phoneInput)
    const normalized = normalizePhoneNumber(phoneInput)
    const isValid = validatePhone(phoneInput)
    
    setFormattedPhone(formatted)
    setNormalizedPhone(normalized)
    
    console.log({
      input: phoneInput,
      formatted,
      normalized,
      isValid
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Phone Number Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="phone-input">Enter Phone Number</Label>
          <Input
            id="phone-input"
            type="tel"
            placeholder="9876543210 or +91 98765 43210"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <Button onClick={handleTest} className="w-full">
          Test Formatting
        </Button>
        
        {formattedPhone && (
          <div className="space-y-2">
            <div>
              <Label className="text-sm font-medium">Formatted:</Label>
              <p className="text-sm text-gray-600">{formattedPhone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Normalized:</Label>
              <p className="text-sm text-gray-600">{normalizedPhone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Valid:</Label>
              <p className="text-sm text-gray-600">{validatePhone(phoneInput) ? "✅ Yes" : "❌ No"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 