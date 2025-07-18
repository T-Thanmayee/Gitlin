"use client"

import { useState, useEffect } from "react"
import { MessageCircle, ArrowLeft, Send, Users, Clock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"
import io from "socket.io-client"
import { toast } from "sonner"
import LinkedInChatPage from "./ChatRoom"

// Initialize Socket.IO client
const socket = io("https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/", { withCredentials: true })

export default function MentorMessages() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const mentorId = "6877d6f580b7beac37c9fb99" // Replace with your mentor's ObjectId
  const [showLinkedInChat, setShowLinkedInChat] = useState(false)
  const [linkedInChatUserId, setLinkedInChatUserId] = useState(null)

  // Fetch users who messaged the mentor
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/mentors/${mentorId}/messages/users`,
        )
        console.log("Fetched users:", response.data)
        setUsers(response.data)
        setError(null)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users. Please try again.")
        toast.error("Failed to load users.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()

    // Join mentor's room
    socket.emit("joinMentor", mentorId, (response) => {
      console.log("Joined mentor room:", response)
    })

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message)
      if (
        selectedUser &&
        (message.senderId.toString() === selectedUser.userId.toString() ||
          message.receiverId.toString() === selectedUser.userId.toString()) &&
        (message.senderId.toString() === mentorId || message.receiverId.toString() === mentorId)
      ) {
        setMessages((prev) => {
          // Replace optimistic message if it exists
          const filteredMessages = prev.filter((msg) => !msg.tempId || msg.tempId !== message.tempId)
          return [...filteredMessages, message]
        })
      }
      // Update user list with new message
      setUsers((prev) =>
        prev.map((user) =>
          user.userId.toString() === message.senderId.toString() ||
          user.userId.toString() === message.receiverId.toString()
            ? { ...user, latestMessage: message.content, latestMessageTime: message.createdAt }
            : user,
        ),
      )
    })

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server")
    })

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error)
      setError("Failed to connect to chat server.")
      toast.error("Failed to connect to chat server.")
    })

    return () => {
      socket.off("receiveMessage")
      socket.off("connect")
      socket.off("connect_error")
    }
  }, [selectedUser, mentorId])

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser) {
      const fetchChatHistory = async () => {
        setLoading(true)
        try {
          const response = await axios.get(
            `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/mentors/${selectedUser.mentorShortName}/chat?userId=${selectedUser.userId}`,
          )
          console.log("Fetched chat history:", response.data)
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
      socket.emit("joinChat", { userId: selectedUser.userId, mentorId }, (response) => {
        console.log("Joined chat room:", response)
      })
    }
  }, [selectedUser])

  const handleUserClick = async (user) => {
    try {
      const mentor = await axios.get(
        `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/mentors/${mentorId}`,
      )
      setSelectedUser({ ...user, mentorShortName: mentor.data.shortName })
    } catch (error) {
      console.error("Error fetching mentor shortName:", error)
      toast.error("Failed to load mentor details.")
    }
  }

  const handleLinkedInChatClick = (user, event) => {
    event.stopPropagation() // Prevent the card click from firing
    setLinkedInChatUserId(user.userId)
    setShowLinkedInChat(true)
  }

  const handleBackFromLinkedInChat = () => {
    setShowLinkedInChat(false)
    setLinkedInChatUserId(null)
  }

  const handleBackToList = () => {
    setSelectedUser(null)
    setMessages([])
    setError(null)
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const tempMessage = {
        senderId: mentorId,
        receiverId: selectedUser.userId,
        content: newMessage,
        createdAt: new Date(),
        tempId: Date.now(),
      }
      console.log("Optimistic message added:", tempMessage)
      setMessages((prev) => [...prev, tempMessage])

      socket.emit(
        "sendMessage",
        {
          senderId: mentorId,
          receiverId: selectedUser.userId,
          content: newMessage,
          tempId: tempMessage.tempId, // Include tempId for server to echo back
        },
        (response) => {
          console.log("Send message response:", response)
          if (response.status === "error") {
            console.error("Send message failed:", response.error)
            setMessages((prev) => prev.filter((msg) => msg.tempId !== tempMessage.tempId))
            setError(response.error)
            toast.error(response.error)
          }
        },
      )
      setNewMessage("")
    }
  }

  if (showLinkedInChat && linkedInChatUserId) {
    return (
      <div className="relative">
        <Button
          onClick={handleBackFromLinkedInChat}
          className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-gray-700 border border-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
        <LinkedInChatPage userId={linkedInChatUserId} />
      </div>
    )
  }

  if (selectedUser) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl m-4 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="text-white hover:bg-white/20 transition-all duration-200 rounded-full p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Avatar className="h-14 w-14 ring-4 ring-white/30 shadow-lg">
                  <AvatarImage src="/placeholder.svg" alt={selectedUser.username} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white font-bold text-lg">
                    {selectedUser.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-xl text-white drop-shadow-sm">{selectedUser.username}</h2>
                <div className="flex items-center gap-2 text-white/80">
                  <Mail className="h-4 w-4" />
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white/50 to-gray-50/50 backdrop-blur-sm">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="ml-3 text-gray-600">Loading messages...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 inline-block">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            )}
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={msg._id || msg.tempId}
                  className={`flex ${msg.senderId.toString() === mentorId ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`relative max-w-xs lg:max-w-md ${msg.senderId.toString() === mentorId ? "order-2" : "order-1"}`}
                  >
                    <div
                      className={`rounded-3xl p-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
                        msg.senderId.toString() === mentorId
                          ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white ml-4"
                          : "bg-white/90 text-gray-800 mr-4 border border-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="h-3 w-3 opacity-70" />
                        <span
                          className={`text-xs opacity-70 ${msg.senderId.toString() === mentorId ? "text-white" : "text-gray-500"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    {/* Message tail */}
                    <div
                      className={`absolute top-4 w-0 h-0 ${
                        msg.senderId.toString() === mentorId
                          ? "-right-2 border-l-8 border-l-purple-500 border-t-8 border-t-transparent border-b-8 border-b-transparent"
                          : "-left-2 border-r-8 border-r-white border-t-8 border-t-transparent border-b-8 border-b-transparent"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white/90 backdrop-blur-sm border-t border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-12 rounded-full border-2 border-gray-200 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full shadow-lg mb-6">
            <MessageCircle className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Your Messages</h1>
          </div>
          <p className="text-gray-600 text-lg">Connect with your mentees and guide their journey</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading conversations...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 inline-block">
              <p className="text-red-600 font-semibold text-lg">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && users.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-100 inline-block">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No messages yet</h3>
              <p className="text-gray-500 text-lg">Your mentees will appear here when they reach out</p>
            </div>
          </div>
        )}

        {/* User List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user, index) => (
            <Card
              key={user.userId}
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleUserClick(user)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-4 ring-purple-100 group-hover:ring-purple-200 transition-all duration-300 shadow-lg">
                      <AvatarImage src="/placeholder.svg" alt={user.username} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white font-bold text-xl">
                        {user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-200 truncate">
                      {user.username}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">{user.latestMessage}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(user.latestMessageTime).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => handleLinkedInChatClick(user, e)}
                      className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors duration-200"
                    >
                      Active Chat
                    </button>
                    <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
