"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ConnectionTest() {
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const testBackendConnection = async () => {
    setIsLoading(true)
    setTestResult("Testing...")

    try {
      // Test health check
      const healthResponse = await fetch('http://localhost:5000/')
      const healthText = await healthResponse.text()
      
      if (healthResponse.ok && healthText.includes("AI backend is running")) {
        setTestResult("✅ Backend is running and accessible!")
      } else {
        setTestResult("❌ Backend health check failed")
        return
      }

      // Test AI message endpoint
      const aiResponse = await fetch('http://localhost:5000/api/ai/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPhone: '+918958979924',
          message: 'Hello, test message'
        }),
      })

      if (aiResponse.ok) {
        const aiData = await aiResponse.json()
        setTestResult(`✅ Backend connection successful!\n\nAI Response: "${aiData.response}"`)
      } else {
        setTestResult(`❌ AI endpoint failed: ${aiResponse.status}`)
      }

    } catch (error) {
      setTestResult(`❌ Connection failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader>
          <h3 className="font-semibold">Backend Connection Test</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testBackendConnection} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
          
          {testResult && (
            <div className="text-sm whitespace-pre-line bg-gray-100 p-3 rounded">
              {testResult}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 