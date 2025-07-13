"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, X, Minus, Send, Mic, MicOff, PhoneCall, PhoneOff, Volume2, VolumeX, Loader2 } from "lucide-react"
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
  isListening: boolean
  isProcessing: boolean
  isSpeaking: boolean
}

interface VoiceState {
  recognition: any
  synthesis: SpeechSynthesis
  isSupported: boolean
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
  const [isLoading, setIsLoading] = useState(false)
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    duration: 0,
    isMuted: false,
    isOnHold: false,
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
  })
  const [unreadCount, setUnreadCount] = useState(0)
  const [voiceState, setVoiceState] = useState<VoiceState>({
    recognition: null,
    synthesis: window.speechSynthesis,
    isSupported: false,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  // Add a ref to always have the latest callState
  const callStateRef = useRef(callState)
  useEffect(() => { callStateRef.current = callState }, [callState])

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
          setCallState(prev => ({ ...prev, isListening: true }))
        }

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          handleVoiceInput(transcript)
        }

        recognition.onend = () => {
          setCallState(prev => ({ ...prev, isListening: false }))
          // Restart listening if call is active and not on hold
          if (callState.isActive && !callState.isOnHold && !callState.isProcessing) {
            setTimeout(() => {
              if (callState.isActive && !callState.isOnHold) {
                recognition.start()
              }
            }, 1000)
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setCallState(prev => ({ ...prev, isListening: false }))
        }

        setVoiceState({
          recognition,
          synthesis: window.speechSynthesis,
          isSupported: true,
        })
      }
    }
  }, [callState.isActive, callState.isOnHold, callState.isProcessing])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Call timer
  useEffect(() => {
    if (callState.isActive && !callState.isOnHold && !callState.isSpeaking && !callState.isProcessing) {
      callTimerRef.current = setInterval(() => {
        setCallState((prev) => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)
      console.log('Timer STARTED - User can speak')
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
        console.log('Timer PAUSED - Agent speaking or processing')
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [callState.isActive, callState.isOnHold, callState.isSpeaking, callState.isProcessing])

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

  const speakText = (text: string) => {
    if (voiceState.synthesis && !callStateRef.current.isMuted) {
      // Stop speech recognition when agent starts speaking
      if (voiceState.recognition) {
        voiceState.recognition.stop()
      }
      
      setCallState(prev => ({ ...prev, isSpeaking: true }))
      
      // Cancel any ongoing speech
      voiceState.synthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => {
        setCallState(prev => ({ ...prev, isSpeaking: false }))
        // Resume listening after speaking with a delay, using latest state
        if (callStateRef.current.isActive && !callStateRef.current.isOnHold && voiceState.recognition) {
          setTimeout(() => {
            try {
              voiceState.recognition.start()
            } catch (error) {
              console.log('Recognition already started or not available')
            }
          }, 1000)
        }
      }
      
      voiceState.synthesis.speak(utterance)
    }
  }

  const handleVoiceInput = async (transcript: string) => {
    // Stop recognition while processing
    if (voiceState.recognition) {
      voiceState.recognition.stop()
    }
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: transcript,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Set processing state
    setCallState(prev => ({ ...prev, isProcessing: true }))

    try {
      // Get user's phone number from auth context or use default
      const userPhone = user?.phone || '+918958979924'
      
      // Send to backend
      const response = await fetch('http://localhost:5000/api/ai/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPhone: userPhone,
          message: transcript,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add bot response to chat
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])

        // Speak the response (this will handle mic restart)
        speakText(data.response)
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error calling backend:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      speakText("I'm sorry, I'm having trouble connecting right now. Please try again.")
    } finally {
      setCallState(prev => ({ ...prev, isProcessing: false }))
    }
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

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Clear input
    setInputMessage("")

    // Set loading state
    setIsLoading(true)

    try {
      // Get user's phone number from auth context or use default
      const userPhone = user?.phone || '+918958979924'
      
      // Send to backend
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPhone: userPhone,
          message: message,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add bot response to chat
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error calling backend:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartCall = () => {
    if (!voiceState.isSupported) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    setCallState({
      isActive: true,
      duration: 0,
      isMuted: false,
      isOnHold: false,
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
    })
    setActiveTab("call")
    // DO NOT start listening immediately
    // Instead, greet first, then open mic after TTS ends
    setTimeout(() => {
      speakText("Hello! I'm your Walmart assistant. How can I help you today?")
    }, 500)
  }

  const handleEndCall = () => {
    // Stop speech synthesis
    if (voiceState.synthesis) {
      voiceState.synthesis.cancel()
    }

    // Stop speech recognition
    if (voiceState.recognition) {
      voiceState.recognition.stop()
    }

    setCallState({
      isActive: false,
      duration: 0,
      isMuted: false,
      isOnHold: false,
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
    })
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
    }
  }

  const toggleMute = () => {
    if (callState.isMuted) {
      // Unmute
      if (voiceState.synthesis) {
        voiceState.synthesis.resume()
      }
    } else {
      // Mute
      if (voiceState.synthesis) {
        voiceState.synthesis.pause()
      }
    }
    setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }))
  }

  const toggleHold = () => {
    if (callState.isOnHold) {
      // Resume call
      if (voiceState.recognition) {
        voiceState.recognition.start()
      }
    } else {
      // Put on hold
      if (voiceState.recognition) {
        voiceState.recognition.stop()
      }
      if (voiceState.synthesis) {
        voiceState.synthesis.pause()
      }
    }
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
                Voice Call
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
                  {isLoading && (
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
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleSendMessage(inputMessage)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Voice Call Interface */}
            {activeTab === "call" && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                {!callState.isActive ? (
                  <>
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Phone className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">Voice Call Support</h3>
                      <p className="text-sm text-gray-600">Speak with our AI assistant</p>
                      {!voiceState.isSupported && (
                        <p className="text-xs text-red-500">Voice not supported in this browser</p>
                      )}
                    </div>
                    <Button 
                      onClick={handleStartCall} 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={!voiceState.isSupported}
                    >
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Start Voice Call
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                        callState.isListening ? 'bg-green-100 animate-pulse' : 
                        callState.isProcessing ? 'bg-yellow-100' : 
                        callState.isSpeaking ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {callState.isListening ? (
                          <Mic className="w-8 h-8 text-green-600" />
                        ) : callState.isProcessing ? (
                          <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
                        ) : callState.isSpeaking ? (
                          <Volume2 className="w-8 h-8 text-blue-600" />
                        ) : (
                          <Phone className="w-8 h-8 text-gray-600" />
                        )}
                      </div>
                      <h3 className="font-semibold">
                        {callState.isListening ? "Listening..." :
                         callState.isProcessing ? "Processing..." :
                         callState.isSpeaking ? "Speaking..." :
                         callState.isOnHold ? "On Hold" : "Connected"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {callState.isListening ? "Speak now..." :
                         callState.isProcessing ? "Thinking..." :
                         callState.isSpeaking ? "AI is responding..." :
                         callState.isOnHold ? "Call paused" : "Voice call active"}
                      </p>
                      <p className="text-lg font-mono">{formatCallDuration(callState.duration)}</p>
                      
                      {/* Mic Status Indicator */}
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${
                          callState.isListening ? 'bg-green-500 animate-pulse' : 
                          callState.isSpeaking ? 'bg-blue-500' : 
                          callState.isProcessing ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-gray-500">
                          {callState.isListening ? "Mic Active" :
                           callState.isSpeaking ? "Agent Speaking" :
                           callState.isProcessing ? "Processing" : "Ready"}
                        </span>
                      </div>
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
