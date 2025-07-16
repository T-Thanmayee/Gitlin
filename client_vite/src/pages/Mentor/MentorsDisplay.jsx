"use client"

import { useState } from "react"
import { Search, MessageCircle, Video, Phone, MoreVertical, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    expertise: "Frontend Development",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "Sure, I can help you with React hooks!",
    lastMessageTime: "2m ago",
    rating: 4.9,
    responseTime: "< 5 min",
    price: 45,
    bio: "Senior Frontend Developer with 8+ years experience in React, Vue, and Angular.",
  },
  {
    id: 2,
    name: "Michael Chen",
    expertise: "Backend Development",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "Let me review your API design...",
    lastMessageTime: "15m ago",
    rating: 4.8,
    responseTime: "< 10 min",
    price: 60,
    bio: "Full-stack engineer specializing in Node.js, Python, and cloud architecture.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    expertise: "UI/UX Design",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastMessage: "Great progress on your wireframes!",
    lastMessageTime: "1h ago",
    rating: 4.9,
    responseTime: "< 15 min",
    price: 55,
    bio: "Product designer with expertise in user research and design systems.",
  },
  {
    id: 4,
    name: "David Kim",
    expertise: "Data Science",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "The model looks good, try adjusting...",
    lastMessageTime: "30m ago",
    rating: 4.7,
    responseTime: "< 20 min",
    price: 70,
    bio: "Data scientist with PhD in Machine Learning and 6+ years industry experience.",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    expertise: "Product Management",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastMessage: "Your roadmap needs some refinement",
    lastMessageTime: "2h ago",
    rating: 4.8,
    responseTime: "< 30 min",
    price: 50,
    bio: "Senior Product Manager at tech startups, expert in agile methodologies.",
  },
  {
    id: 6,
    name: "Alex Parker",
    expertise: "DevOps",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "Docker setup is working perfectly now",
    lastMessageTime: "45m ago",
    rating: 4.6,
    responseTime: "< 25 min",
    price: 40,
    bio: "DevOps engineer with expertise in AWS, Docker, Kubernetes, and CI/CD.",
  },
]

export default function MentorChatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [selectedMentor, setSelectedMentor] = useState([])
  const [showChat, setShowChat] = useState(false)

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      selectedFilter === "all" ||
      (selectedFilter === "online" && mentor.isOnline) ||
      (selectedFilter === "offline" && !mentor.isOnline)

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "4.5+" && mentor.rating >= 4.5) ||
      (ratingFilter === "4.0+" && mentor.rating >= 4.0) ||
      (ratingFilter === "3.5+" && mentor.rating >= 3.5)

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under-50" && mentor.price < 50) ||
      (priceFilter === "50-60" && mentor.price >= 50 && mentor.price <= 60) ||
      (priceFilter === "above-60" && mentor.price > 60)

    return matchesSearch && matchesStatus && matchesRating && matchesPrice
  })

  const handleChatClick = (mentor) => {
    setSelectedMentor(mentor)
    setShowChat(true)
  }

  const handleBackToList = () => {
    setShowChat(false)
    setSelectedMentor(null)
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
                    <AvatarImage src={selectedMentor.avatar || "/placeholder.svg"} alt={selectedMentor.name} />
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
                    {selectedMentor.isOnline ? "Online" : "Last seen 2h ago"} • {selectedMentor.expertise}
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
            <div className="space-y-4">
              {/* Sample Messages */}
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                  <p className="text-sm text-gray-800">
                    Hi! I saw your question about React hooks. I'd be happy to help you understand them better.
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">10:30 AM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Thanks! I'm struggling with useEffect and its dependencies.</p>
                  <span className="text-xs text-blue-100 mt-1 block">10:32 AM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                  <p className="text-sm text-gray-800">
                    Perfect! Let's start with the basics. useEffect runs after every render by default...
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">10:33 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
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

            {/* Rating Filter */}
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

            {/* Price Filter */}
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
          <p className="text-gray-600">
            Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Mentor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
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
                      {mentor.expertise}
                    </Badge>
                    <p className="text-sm text-gray-600 mb-3">{mentor.bio}</p>
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
                    <span className="text-gray-500">Response:</span>
                    <span className="font-medium">{mentor.responseTime}</span>
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
        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mentors found matching your criteria</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}
