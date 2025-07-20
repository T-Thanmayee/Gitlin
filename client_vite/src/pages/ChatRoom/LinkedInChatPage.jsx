"use client";

import { useState, useEffect } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import io from "socket.io-client";
import { toast } from "sonner";

// Initialize Socket.IO client
const socket = io("https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/", {
  withCredentials: true,
});

export default function MentorMessages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mentorId = "6877d6f580b7beac37c9fb99"; // Mentor ObjectId

  // Fetch users who messaged the mentor
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/mentors/${mentorId}/messages/users`
        );
        console.log("Fetched users:", response.data);
        setUsers(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    // Join mentor's room
    socket.emit("joinMentor", mentorId, (response) => {
      console.log("Joined mentor room:", response);
    });

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      if (
        selectedUser &&
        (message.senderId.toString() === selectedUser.userId.toString() ||
          message.receiverId.toString() === selectedUser.userId.toString()) &&
        (message.senderId.toString() === mentorId || message.receiverId.toString() === mentorId)
      ) {
        setMessages((prev) => {
          // Replace optimistic message if it exists
          const filteredMessages = prev.filter((msg) => !msg.tempId || msg.tempId !== message.tempId);
          return [...filteredMessages, message];
        });
      }
      // Update user list with new message
      setUsers((prev) =>
        prev.map((user) =>
          user.userId.toString() === message.senderId.toString() ||
          user.userId.toString() === message.receiverId.toString()
            ? { ...user, latestMessage: message.content, latestMessageTime: message.createdAt }
            : user
        )
      );
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setError("Failed to connect to chat server.");
      toast.error("Failed to connect to chat server.");
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [selectedUser, mentorId]);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser) {
      const fetchChatHistory = async () => {
        setLoading(true);
        try {
          const mentor = await axios.get(
            `https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/mentors/${mentorId}`
          );
          const response = await axios.get(
            `https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/mentors/${mentorId}/chat`,
            {
              params: { userId: selectedUser.userId },
            }
          );
          console.log("Fetched chat history:", response.data);
          setMessages(response.data);
          setError(null);
        } catch (error) {
          console.error("Error fetching chat history:", error);
          setError("Failed to load chat history. Please try again.");
          toast.error("Failed to load chat history.");
        } finally {
          setLoading(false);
        }
      };
      fetchChatHistory();

      const room = [selectedUser.userId, mentorId].sort().join("_");
      socket.emit("joinChat", { userId: selectedUser.userId, mentorId }, (response) => {
        console.log("Joined chat room:", response);
      });
    }
  }, [selectedUser, mentorId]);

  const handleUserClick = async (user) => {
    try {
      const mentor = await axios.get(`https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/mentors/${mentorId}`);
      setSelectedUser({ ...user, mentorShortName: mentor.data.shortName });
    } catch (error) {
      console.error("Error fetching mentor shortName:", error);
      toast.error("Failed to load mentor details.");
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setMessages([]);
    setError(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const tempMessage = {
        senderId: mentorId,
        receiverId: selectedUser.userId,
        content: newMessage,
        createdAt: new Date(),
        tempId: Date.now(),
      };
      console.log("Optimistic message added:", tempMessage);
      setMessages((prev) => [...prev, tempMessage]);
      socket.emit(
        "sendMessage",
        {
          senderId: mentorId,
          receiverId: selectedUser.userId,
          content: newMessage,
          tempId: tempMessage.tempId, // Include tempId for server to echo back
        },
        (response) => {
          console.log("Send message response:", response);
          if (response.status === "error") {
            console.error("Send message failed:", response.error);
            setMessages((prev) => prev.filter((msg) => msg.tempId !== tempMessage.tempId));
            setError(response.error);
            toast.error(response.error);
          }
        }
      );
      setNewMessage("");
    }
  };

  if (selectedUser) {
    return (
      <div
        className="flex h-screen bg-gradient-to-br from-blue-50 to-gray-100"
        style={{ backgroundImage: "linear-gradient(to bottom right, #e0f7fa, #f0f4f8)" }}
      >
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Chat Header */}
          <div className="bg-white shadow-md border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleBackToList} className="hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <Avatar className="h-12 w-12 border-2 border-blue-200">
                <AvatarImage src="/placeholder.svg" alt={selectedUser.username} className="object-cover" />
                <AvatarFallback className="bg-blue-100 text-blue-800">{selectedUser.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold text-xl text-gray-900">{selectedUser.username}</h2>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-white/80 backdrop-blur-md rounded-lg shadow-inner">
            {loading && <p className="text-center text-gray-500 animate-pulse">Loading messages...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id || msg.tempId}
                  className={`flex ${
                    msg.senderId.toString() === mentorId ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      msg.senderId.toString() === mentorId
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-900 shadow-md"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        msg.senderId.toString() === mentorId ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100"
      style={{ backgroundImage: "linear-gradient(to bottom right, #e0f7fa, #f0f4f8)" }}
    >
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Your Messages
          </h1>
          <p className="text-gray-600 text-lg">View and manage your conversations</p>
        </div>

        {loading && <p className="text-center text-gray-500 animate-pulse">Loading users...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="text-gray-500 text-center py-12">No messages yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card
              key={user.userId}
              className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-md border border-gray-100"
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-indigo-200">
                    <AvatarImage src="/placeholder.svg" alt={user.username} className="object-cover" />
                    <AvatarFallback className="bg-indigo-100 text-indigo-800">{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-600 truncate">{user.latestMessage}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(user.latestMessageTime).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleUserClick(user)}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 transition-all duration-200"
                >
                  Active Chat
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}