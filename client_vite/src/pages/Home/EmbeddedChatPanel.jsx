"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"

export function EmbeddedChatPanel() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome! I'm here to assist you with any questions.", sender: "bot" },
    { id: 2, text: "What can I help you with today?", sender: "bot" },
  ])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null);

  useEffect(() => {
   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = { id: Date.now(), text: inputValue, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setLoading(true)

    try {
      // 👉 Replace with your HuggingFace Space API URL
      const response = await fetch("https://ltk242111-ltk.hf.space/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: inputValue,
          context: "Gitlin is a platform for collaborative coding and project management. It allows users to create, manage, and collaborate on coding projects with features like version control, real-time collaboration, and project organization. Gitlin supports various programming languages and provides tools for team communication and project tracking. It is designed to enhance productivity and streamline the coding process for individuals and teams. Gitlin also offers features like code reviews, issue tracking, and integration with popular development tools to facilitate efficient project management and collaboration. Gitlin aims to provide a comprehensive solution for developers and teams to work together effectively on coding projects. It is suitable for both small teams and large organizations, providing scalability and flexibility to meet diverse project needs. Gitlin is built with a focus on user experience, making it easy for users to navigate and utilize its features. It also emphasizes security and data privacy, ensuring that user projects are protected and confidential. Overall, Gitlin is a powerful platform for anyone looking to enhance their coding and project management capabilities. It is ideal for developers, teams, and organizations seeking to improve collaboration, streamline workflows, and achieve better project outcomes.",
        }),
      })

      const data = await response.json()

      const botMessage = {
        id: Date.now() + 1,
        text: data.answer || "Sorry, I couldn’t find an answer.",
        sender: "bot",
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "⚠️ Error connecting to the server.", sender: "bot" },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col border-2 border-primary/20">
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary-foreground text-primary">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Support Assistant</h3>
            <p className="text-xs opacity-90">{loading ? "Typing..." : "Online now"}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className={message.sender === "user" ? "bg-secondary" : "bg-primary"}>
                {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={loading} className="px-6">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </Card>
  )
}
