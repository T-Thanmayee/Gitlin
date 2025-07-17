"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, MoreHorizontal, Phone, Video, Info, Paperclip, Smile, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import io from "socket.io-client";
import axios from "axios";

export default function LinkedInChatPage({ userId }) {
  console.log("LinkedInChatPage rendered with userId:", userId);
  const [searchQuery, setSearchQuery] = useState("");
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket.IO and fetch initial data
  useEffect(() => {
    if (!userId) {
      setError("User ID is missing");
      setLoading(false);
      return;
    }

    // Connect to Socket.IO server
    socketRef.current = io("https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev", {
      withCredentials: true,
    });
    console.log("Socket.IO connecting...");

    // Emit user login
    socketRef.current.emit("userLogin", userId);

    // Fetch connections (followers)
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/chat/users/${userId}/followers`,
          { withCredentials: true }
        );
        console.log("Fetched connections:", response.data);
        setConnections(response.data);
        if (response.data.length > 0) {
          setSelectedConnection(response.data[0]);
        } else {
          console.log("No connections found");
          setError("No connections found");
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching connections:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to load connections");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();

    // Socket.IO event listeners
    socketRef.current.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socketRef.current.on("userStatus", ({ userId: id, status }) => {
      console.log(`User ${id} is ${status}`);
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id.toString() === id ? { ...conn, isOnline: status === "online" } : conn
        )
      );
    });

    socketRef.current.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prev) => [
        ...prev,
        {
          id: message._id,
          senderId: message.senderId,
          senderName:
            message.senderId === userId
              ? "You"
              : connections.find((c) => c.id.toString() === message.senderId.toString())?.name || "Unknown",
          message: message.content,
          timestamp: new Date(message.timestamp).toLocaleTimeString(),
          isOwn: message.senderId === userId,
        },
      ]);
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id.toString() === message.senderId && conn.id !== selectedConnection?.id
            ? {
                ...conn,
                unreadCount: conn.unreadCount + 1,
                lastMessage: message.content,
                lastMessageTime: new Date(message.timestamp).toLocaleTimeString(),
              }
            : conn.id === selectedConnection?.id
            ? {
                ...conn,
                lastMessage: message.content,
                lastMessageTime: new Date(message.timestamp).toLocaleTimeString(),
              }
            : conn
        )
      );
    });

    socketRef.current.on("typing", ({ senderId, receiverId, isTyping: typing }) => {
      if (receiverId === userId && senderId === selectedConnection?.id) {
        console.log(`${senderId} is ${typing ? "typing" : "not typing"}`);
        setIsTyping((prev) => ({ ...prev, [senderId]: typing }));
      }
    });

    socketRef.current.on("messagesRead", ({ userId: receiverId, receiverId: senderId }) => {
      if (senderId === selectedConnection?.id) {
        console.log(`Messages from ${senderId} marked as read`);
        setConnections((prev) =>
          prev.map((conn) => (conn.id === senderId ? { ...conn, unreadCount: 0 } : conn))
        );
      }
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setError("Failed to connect to chat server");
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
      console.log("Socket.IO disconnected");
    };
  }, [userId]);

  // Fetch messages when selected connection changes
  useEffect(() => {
    if (selectedConnection) {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/chat/messages/${userId}/${selectedConnection.id}`,
            { withCredentials: true }
          );
          console.log("Fetched messages:", response.data);
          setMessages(response.data);
          socketRef.current.emit("markMessagesRead", { userId, receiverId: selectedConnection.id });
          setConnections((prev) =>
            prev.map((conn) =>
              conn.id === selectedConnection.id ? { ...conn, unreadCount: 0 } : conn
            )
          );
          setError(null);
        } catch (error) {
          console.error("Error fetching messages:", error.response?.data || error.message);
          setError(error.response?.data?.message || "Failed to load messages");
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [selectedConnection, userId]);

  // Handle typing indicator
  useEffect(() => {
    if (selectedConnection) {
      const typingTimeout = setTimeout(() => {
        socketRef.current.emit("typing", {
          senderId: userId,
          receiverId: selectedConnection.id,
          isTyping: newMessage.trim().length > 0,
        });
      }, 300);

      return () => clearTimeout(typingTimeout);
    }
  }, [newMessage, selectedConnection, userId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConnection) {
      console.log("Sending message:", { senderId: userId, receiverId: selectedConnection.id, content: newMessage });
      socketRef.current.emit("sendMessage", {
        senderId: userId,
        receiverId: selectedConnection.id,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {loading && <p className="p-4 text-gray-500">Loading connections...</p>}
          {error && <p className="p-4 text-red-500">{error}</p>}
          {!loading && !error && filteredConnections.length === 0 && (
            <p className="p-4 text-gray-500">No connections found</p>
          )}
          {filteredConnections.map((connection) => (
            <div
              key={connection.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedConnection?.id === connection.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
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
                      {isTyping[connection.id] ? (
                        <span className="text-blue-500 italic">typing...</span>
                      ) : (
                        connection.lastMessage || "No messages yet"
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
        {selectedConnection ? (
          <>
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

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4 max-w-4xl mx-auto">
                {loading && <p className="text-gray-500">Loading messages...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && messages.length === 0 && (
                  <p className="text-gray-500">No messages yet</p>
                )}
                {messages.map((message) => (
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
                <div ref={messagesEndRef} />
              </div>
            </div>

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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a connection to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}