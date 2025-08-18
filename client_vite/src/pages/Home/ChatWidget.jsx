"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMessage.text),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  // Simple bot responses
  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase()

    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! Nice to meet you. What can I help you with today?"
    } else if (input.includes("help")) {
      return "I'm here to help! You can ask me about our services, products, or any questions you might have."
    } else if (input.includes("price") || input.includes("cost")) {
      return "For pricing information, I'd be happy to connect you with our sales team. What specific product or service are you interested in?"
    } else if (input.includes("contact")) {
      return "You can reach us at contact@example.com or call us at (555) 123-4567. Our support team is available 24/7!"
    } else {
      return "That's a great question! Could you provide a bit more detail about what you're looking for?"
    }
  }

  // Handle Enter press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-8 right-8 z-50 transition-all duration-500 ease-out",
          isOpen ? "w-96 h-[32rem]" : "w-16 h-16",
        )}
      >
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 hover:scale-110 group"
          >
            <MessageCircle className="h-7 w-7 transition-transform group-hover:scale-110" />
          </Button>
        ) : (
          <Card className="w-full h-full shadow-2xl border-0 bg-card backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-t-xl">
              <CardTitle className="text-lg font-semibold flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                AI Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 rounded-full transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-full">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 max-w-[80%] animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                        message.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                          message.sender === "user"
                            ? "bg-gradient-to-br from-accent to-primary"
                            : "bg-gradient-to-br from-primary to-accent",
                        )}
                      >
                        {message.sender === "bot" ? (
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <User className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>

                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                          message.sender === "user"
                            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                            : "bg-muted text-foreground border border-border/50",
                        )}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3 max-w-[80%] animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted text-foreground rounded-2xl px-4 py-3 text-sm border border-border/50 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="flex gap-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!inputValue.trim()}
                    className="rounded-xl w-12 h-12 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
