"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, X, Minus, Send, Mic, MicOff, PhoneCall, PhoneOff, Volume2, VolumeX } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface CallState {
  isActive: boolean
  duration: number
  isMuted: boolean
  isOnHold: boolean
}

export default function ChatbotWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "call">("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello${user ? ` ${user.name}` : ""}! I'm your Walmart assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    duration: 0,
    isMuted: false,
    isOnHold: false,
  })
  const [unreadCount, setUnreadCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Call timer
  useEffect(() => {
    if (callState.isActive && !callState.isOnHold) {
      callTimerRef.current = setInterval(() => {
        setCallState((prev) => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [callState.isActive, callState.isOnHold])

  // Update unread count
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === "bot") {
        setUnreadCount((prev) => prev + 1)
      }
    }
  }, [messages, isOpen])

  // Clear unread count when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("order") || message.includes("track")) {
      return "I can help you track your orders! Please provide your order number, or you can check your account page for order history."
    }

    if (message.includes("return") || message.includes("refund")) {
      return "For returns and refunds, you can start a return request in your account. Most items can be returned within 90 days with a receipt."
    }

    if (message.includes("delivery") || message.includes("shipping")) {
      return "We offer free shipping on orders over $35! You can also choose pickup or same-day delivery in many areas."
    }

    if (message.includes("price") || message.includes("deal") || message.includes("discount")) {
      return "Check out our current deals on the homepage! We have daily rollbacks and special promotions. Would you like me to help you find deals in a specific category?"
    }

    if (message.includes("product") || message.includes("find") || message.includes("search")) {
      return "I can help you find products! What are you looking for? You can also use the search bar at the top of the page."
    }

    if (message.includes("account") || message.includes("login") || message.includes("sign in")) {
      return "Having trouble with your account? You can sign in using the account button in the top right corner. Need help resetting your password?"
    }

    if (message.includes("store") || message.includes("location") || message.includes("hours")) {
      return "To find store locations and hours, click on 'Pickup or delivery?' in the header. You can also call your local store directly."
    }

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return `Hello${user ? ` ${user.name}` : ""}! How can I assist you with your Walmart shopping today?`
    }

    if (message.includes("thank") || message.includes("thanks")) {
      return "You're welcome! Is there anything else I can help you with today?"
    }

    return "I'm here to help with your Walmart shopping experience! You can ask me about orders, returns, products, deals, or store information. What would you like to know?"
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(inputMessage),
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleStartCall = () => {
    setCallState({
      isActive: true,
      duration: 0,
      isMuted: false,
      isOnHold: false,
    })
    setActiveTab("call")
  }

  const handleEndCall = () => {
    setCallState({
      isActive: false,
      duration: 0,
      isMuted: false,
      isOnHold: false,
    })
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
    }
  }

  const toggleMute = () => {
    setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }))
  }

  const toggleHold = () => {
    setCallState((prev) => ({ ...prev, isOnHold: !prev.isOnHold }))
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className={`w-80 shadow-xl transition-all duration-300 ${isMinimized ? "h-14" : "h-96"}`}>
        <CardHeader className="flex flex-row items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">*</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Walmart Assistant</h3>
              <p className="text-xs opacity-90">
                {callState.isActive ? `Call - ${formatCallDuration(callState.duration)}` : "Online"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-blue-700 p-1 h-auto"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 h-80 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b">
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("chat")}
                className={`flex-1 rounded-none ${
                  activeTab === "chat" ? "bg-blue-100 text-blue-600" : "text-gray-600"
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </Button>
              <Button
                variant={activeTab === "call" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("call")}
                className={`flex-1 rounded-none ${
                  activeTab === "call" ? "bg-blue-100 text-blue-600" : "text-gray-600"
                }`}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            </div>

            {/* Chat Interface */}
            {activeTab === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 p-2 rounded-lg text-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Call Interface */}
            {activeTab === "call" && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                {!callState.isActive ? (
                  <>
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Phone className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">Call Walmart Support</h3>
                      <p className="text-sm text-gray-600">Speak with a customer service representative</p>
                    </div>
                    <Button onClick={handleStartCall} className="bg-green-600 hover:bg-green-700 text-white">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Start Call
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Phone className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold">Connected</h3>
                      <p className="text-sm text-gray-600">
                        {callState.isOnHold ? "On Hold" : "Speaking with support"}
                      </p>
                      <p className="text-lg font-mono">{formatCallDuration(callState.duration)}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={toggleMute} variant={callState.isMuted ? "destructive" : "outline"} size="sm">
                        {callState.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button onClick={toggleHold} variant={callState.isOnHold ? "destructive" : "outline"} size="sm">
                        {callState.isOnHold ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Button onClick={handleEndCall} variant="destructive" size="sm">
                        <PhoneOff className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
