"use client"

import { useState, useEffect } from "react"
import { Search, MessageCircle, Video, Phone, MoreVertical, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import io from "socket.io-client"
import axios from "axios"
import { toast } from "sonner" // Use sonner instead of toast

// Initialize Socket.IO client
const socket = io("https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev", { withCredentials: true })

export default function MentorChatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [mentors, setMentors] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const userId = "68513ba087655694a9350b1b" // Default userId
  // const userId = "6877d6f580b7beac37c9fb99"

  // Fetch mentors from backend
  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true)
      try {
        const params = {}
        if (selectedFilter !== "all") {
          params.isOnline = selectedFilter === "online"
        }
        if (searchQuery) {
          params.skills = searchQuery
        }
        if (ratingFilter !== "all") {
          params.rating = ratingFilter.replace("+", "")
        }
        if (priceFilter !== "all") {
          if (priceFilter === "under-50") params.price = "0-50"
          else if (priceFilter === "50-60") params.price = "50-60"
          else if (priceFilter === "above-60") params.price = "60"
        }

        const response = await axios.get("https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/mentors", { params })
        setMentors(response.data)
        setError(null)
      } catch (error) {
        console.error("Error fetching mentors:", error)
        setError("Failed to load mentors. Please try again.")
        toast.error("Failed to load mentors.")
      } finally {
        setLoading(false)
      }
    }
    fetchMentors()
  }, [searchQuery, selectedFilter, ratingFilter, priceFilter])

  // Socket.IO setup for real-time updates
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server")
    })

    socket.on("mentorStatus", ({ mentorId, isOnline }) => {
      console.log(`Mentor ${mentorId} is ${isOnline ? "online" : "offline"}`)
      setMentors((prevMentors) =>
        prevMentors.map((mentor) =>
          mentor._id === mentorId ? { ...mentor, isOnline } : mentor
        )
      )
    })

    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message)
      setMessages((prev) => [...prev, message])
    })

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error)
      setError("Failed to connect to chat server.")
      toast.error("Failed to connect to chat server.")
    })

    return () => {
      socket.off("connect")
      socket.off("mentorStatus")
      socket.off("receiveMessage")
      socket.off("connect_error")
    }
  }, [])

  // Fetch chat history when a mentor is selected
  useEffect(() => {
    if (selectedMentor) {
      const fetchChatHistory = async () => {
        setLoading(true)
        try {
          const response = await axios.get(
            `https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/mentors/${selectedMentor.shortName}/chat?userId=${userId}`
          )
          console.log("Chat history fetched:", response.data)
          setMessages(response.data)
          setError(null)
        } catch (error) {
          console.error("Error fetching chat history:", error)
          setError("Failed to load chat history. Please try again.")
          toast.error("Failed to load chat history.")
        } finally {
          setLoading(false)
        }
      }
      fetchChatHistory()

      socket.emit("joinChat", { userId, mentorId: selectedMentor._id }, (response) => {
        console.log("Joined chat room:", response)
      })
    }
  }, [selectedMentor])

  const handleChatClick = (mentor) => {
    setSelectedMentor(mentor)
    setShowChat(true)
  }

  const handleBackToList = () => {
    setShowChat(false)
    setSelectedMentor(null)
    setMessages([])
    setError(null)
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const tempMessage = {
        senderId: userId,
        receiverId: selectedMentor._id,
        content: newMessage,
        createdAt: new Date(),
        tempId: Date.now() // Temporary ID for optimistic update
      }
      // Optimistically add message to UI
      setMessages((prev) => [...prev, tempMessage])
      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: selectedMentor._id,
        content: newMessage,
      }, (response) => {
        console.log("Send message response:", response)
      })
      setNewMessage("")
    }
  }

  if (showChat && selectedMentor) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleBackToList}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedMentor.profileImage || "/placeholder.svg"} alt={selectedMentor.name} />
                    <AvatarFallback>
                      {selectedMentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      selectedMentor.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">{selectedMentor.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedMentor.isOnline ? "Online" : "Last seen 2h ago"} • {selectedMentor.skills.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Session</DropdownMenuItem>
                    <DropdownMenuItem>Block Mentor</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {loading && <p className="text-center text-gray-500">Loading messages...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={msg._id || msg.tempId || index} className={`flex ${msg.senderId.toString() === userId ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg p-3 max-w-xs shadow-sm ${
                      msg.senderId.toString() === userId ? "bg-blue-500 text-white" : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className={`text-xs mt-1 block ${
                      msg.senderId.toString() === userId ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Mentor</h1>
          <p className="text-gray-600">Connect with experienced professionals to accelerate your learning</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online Only</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                <SelectItem value="4.0+">4.0+ Stars</SelectItem>
                <SelectItem value="3.5+">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50">Under $50/hr</SelectItem>
                <SelectItem value="50-60">$50-60/hr</SelectItem>
                <SelectItem value="above-60">Above $60/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          {loading && <p className="text-gray-500">Loading mentors...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <p className="text-gray-600">
              Showing {mentors.length} mentor{mentors.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Mentor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.profileImage || "/placeholder.svg"} alt={mentor.name} />
                      <AvatarFallback className="text-lg">
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        mentor.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{mentor.name}</h3>
                    <Badge variant="secondary" className="mb-2">
                      {mentor.skills.join(", ")}
                    </Badge>
                    <p className="text-sm text-gray-600 mb-3">{mentor.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rating:</span>
                    <span className="font-medium">⭐ {mentor.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium text-green-600">${mentor.price}/hr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${mentor.isOnline ? "text-green-600" : "text-gray-500"}`}>
                      {mentor.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleChatClick(mentor)} className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {!loading && mentors.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mentors found matching your criteria</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}