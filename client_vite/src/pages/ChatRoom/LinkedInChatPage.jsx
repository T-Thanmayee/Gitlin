"use client"


import { useState } from "react"
import { Search, Send, MoreHorizontal, Phone, Video, Info, Paperclip, Smile, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const connections = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Frontend Developer at Google",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "Thanks for connecting! Would love to discuss React best practices.",
    lastMessageTime: "2m",
    unreadCount: 2,
    isTyping: false,
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Product Manager at Microsoft",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "The project timeline looks good. Let's schedule a call.",
    lastMessageTime: "15m",
    unreadCount: 0,
    isTyping: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "UX Designer at Airbnb",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastMessage: "I've reviewed your portfolio. Impressive work!",
    lastMessageTime: "1h",
    unreadCount: 1,
    isTyping: false,
  },
  {
    id: 4,
    name: "David Kim",
    title: "Data Scientist at Netflix",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "The machine learning model is performing well in production.",
    lastMessageTime: "2h",
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    title: "VP of Engineering at Stripe",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastMessage: "Great meeting you at the conference. Let's stay in touch!",
    lastMessageTime: "1d",
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 6,
    name: "Alex Parker",
    title: "DevOps Engineer at Amazon",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "The deployment pipeline is working smoothly now.",
    lastMessageTime: "2d",
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 7,
    name: "Jennifer Wu",
    title: "Marketing Director at Spotify",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastMessage: "Love your insights on digital marketing trends!",
    lastMessageTime: "3d",
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 8,
    name: "Robert Martinez",
    title: "CTO at Shopify",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "Would you be interested in a technical leadership role?",
    lastMessageTime: "1w",
    unreadCount: 3,
    isTyping: false,
  },
]

const sampleMessages = [
  {
    id: 1,
    senderId: 1,
    senderName: "Sarah Johnson",
    message: "Hi! Thanks for connecting with me on LinkedIn.",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    senderId: "me",
    senderName: "You",
    message: "Thanks for accepting! I really admire your work at Google.",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    senderId: 1,
    senderName: "Sarah Johnson",
    message: "That's very kind of you to say! I saw your profile and your React projects look impressive.",
    timestamp: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    senderId: "me",
    senderName: "You",
    message: "Thank you! I've been working with React for about 3 years now. Always learning something new.",
    timestamp: "10:37 AM",
    isOwn: true,
  },
  {
    id: 5,
    senderId: 1,
    senderName: "Sarah Johnson",
    message: "Thanks for connecting! Would love to discuss React best practices.",
    timestamp: "10:40 AM",
    isOwn: false,
  },
]

export default function LinkedInChatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConnection, setSelectedConnection] = useState(connections[0])
  const [newMessage, setNewMessage] = useState("")

  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Connections List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Messaging</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Connections List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConnections.map((connection) => (
            <div
              key={connection.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedConnection.id === connection.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
              }`}
              onClick={() => setSelectedConnection(connection)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                    <AvatarFallback>
                      {connection.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {connection.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{connection.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{connection.lastMessageTime}</span>
                      {connection.unreadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                          {connection.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 truncate mb-1">{connection.title}</p>

                  <div className="flex items-center">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {connection.isTyping ? (
                        <span className="text-blue-500 italic">typing...</span>
                      ) : (
                        connection.lastMessage
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConnection.avatar || "/placeholder.svg"} alt={selectedConnection.name} />
                  <AvatarFallback>
                    {selectedConnection.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {selectedConnection.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">{selectedConnection.name}</h2>
                <p className="text-sm text-gray-500">{selectedConnection.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4 max-w-4xl mx-auto">
            {sampleMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md ${message.isOwn ? "order-2" : "order-1"}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.isOwn ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${message.isOwn ? "text-right" : "text-left"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-end gap-2">
                  <Input
                    placeholder="Write a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-h-[40px] resize-none"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
