"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import io from "socket.io-client";
import { toast } from "sonner";
import { fetchChatHistory, addMessage, removeMessage } from "../../Redux/Slices/authSlice";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev';

export default function MentorMessages() {
  const dispatch = useDispatch();
  const { currentUser, isPending, errorOccured, errorMessage } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Socket.IO client with authentication
  const socket = io(`${API_URL}/mentor-chat`, {
    auth: {
      token: sessionStorage.getItem('Token'),
    },
    withCredentials: true,
  });

  // Fetch users who messaged the mentor
  useEffect(() => {
    if (!currentUser._id) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/mentors/${currentUser._id}/messages/users`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
            },
          }
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

    socket.emit("joinMentor", currentUser._id, (response) => {
      console.log("Joined mentor room:", response || "No response");
    });

    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      if (
        selectedUser &&
        (message.senderId.toString() === selectedUser.userId.toString() ||
          message.receiverId.toString() === selectedUser.userId.toString()) &&
        (message.senderId.toString() === currentUser._id || message.receiverId.toString() === currentUser._id)
      ) {
        dispatch(addMessage({
          id: message._id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          timestamp: message.timestamp,
          isOwn: message.senderId === currentUser._id,
          senderName: message.senderId === currentUser._id ? "You" : selectedUser.username,
        }));
        setMessages((prev) => {
          const filteredMessages = prev.filter((msg) => !msg.tempId || msg.tempId !== message.tempId);
          return [
            ...filteredMessages,
            {
              id: message._id,
              senderId: message.senderId,
              senderName: message.senderId === currentUser._id ? "You" : selectedUser.username,
              message: message.content,
              timestamp: new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isOwn: message.senderId === currentUser._id,
            },
          ];
        });
      }
      // Update user list with latest message
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
      socket.disconnect();
    };
  }, [selectedUser, currentUser._id, dispatch]);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser && currentUser._id) {
      dispatch(fetchChatHistory({ userId: selectedUser.userId, mentorShortName: selectedUser.mentorShortName }))
        .unwrap()
        .then((data) => {
          setMessages(data.map((msg) => ({
            id: msg._id,
            senderId: msg.senderId,
            senderName: msg.senderId === currentUser._id ? "You" : selectedUser.username,
            message: msg.content,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: msg.senderId === currentUser._id,
          })));
          setError(null);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
          setError("Failed to load chat history. Please try again.");
          toast.error("Failed to load chat history.");
        });

      socket.emit("joinChat", { userId: selectedUser.userId, mentorId: currentUser._id }, (response) => {
        console.log("Joined chat room:", response || "No response");
      });
    }
  }, [selectedUser, currentUser._id, dispatch]);

  const handleUserClick = async (user) => {
    try {
      const mentorResponse = await axios.get(
        `${API_URL}/mentors/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
          },
        }
      );
      setSelectedUser({ ...user, mentorShortName: mentorResponse.data.shortName });
      setMessages([]);
    } catch (error) {
      console.error("Error fetching mentor shortName:", error.response?.data || error.message);
      toast.error("Failed to load mentor details.");
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setMessages([]);
    setError(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser && currentUser._id) {
      const tempId = Date.now().toString();
      const tempMessage = {
        id: tempId,
        tempId,
        senderId: currentUser._id,
        senderName: "You",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      };
      console.log("Optimistic message added:", tempMessage);
      setMessages((prev) => [...prev, tempMessage]);
      dispatch(addMessage({
        senderId: currentUser._id,
        receiverId: selectedUser.userId,
        content: newMessage,
        tempId,
        timestamp: new Date().toISOString(),
      }));

      socket.emit(
        "sendMessage",
        {
          senderId: currentUser._id,
          receiverId: selectedUser.userId,
          content: newMessage,
          tempId,
          debugId: tempId,
          context: "mentor",
        },
        (response) => {
          console.log("Send message response:", response);
          if (response.status === "error") {
            console.error("Send message failed:", response.error);
            setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
            dispatch(removeMessage(tempId));
            setError(response.error);
            toast.error(response.error);
          }
        }
      );
      setNewMessage("");
    }
  };

  if (!currentUser._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <p className="text-gray-600 text-lg">Please log in to view messages</p>
      </div>
    );
  }

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
            {isPending && <p className="text-center text-gray-500 animate-pulse">Loading messages...</p>}
            {errorOccured && <p className="text-center text-red-500">{errorMessage || error}</p>}
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id || msg.tempId}
                  className={`flex ${
                    msg.senderId.toString() === currentUser._id ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      msg.senderId.toString() === currentUser._id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-900 shadow-md"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        msg.senderId.toString() === currentUser._id ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp}
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
                disabled={!newMessage.trim()}
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