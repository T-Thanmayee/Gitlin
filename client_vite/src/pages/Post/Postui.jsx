"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ThumbsUp,
  Send,
  Users,
} from "lucide-react";

// Static posts data
const staticPosts = [
  {
    id: "1",
    user: {
      _id: "user1",
      name: "Sarah Chen",
      title: "Senior Product Manager at Google",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    content:
      "Just shipped a major feature that I've been working on for months! 🚀 The journey from ideation to launch taught me so much about cross-functional collaboration and user-centered design. Grateful for an amazing team that made this possible. #ProductManagement #TeamWork",
    type: "text",
    timestamp: "2 hours ago",
    likes: 234,
    comments: 45,
    shares: 12,
    tags: ["ProductManagement", "TeamWork", "Google"],
    commentsData: [],
  },
  {
    id: "10",
    user: {
      _id: "user2",
      name: "Tom Anderson",
      title: "Mobile App Developer",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    content:
      "React Native vs Flutter: I've built apps with both frameworks. Here's my honest comparison after 2 years of experience with each. The winner might surprise you! 📱",
    type: "video",
    media: "/placeholder.svg?height=400&width=600",
    timestamp: "20 hours ago",
    likes: 345,
    comments: 234,
    shares: 45,
    tags: ["ReactNative", "Flutter", "MobileDev"],
    commentsData: [],
  },
  {
    id: "11",
    user: {
      _id: "user3",
      name: "Sophie Turner",
      title: "Blockchain Developer at Coinbase",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    content:
      "Web3 is evolving rapidly! Here's what I learned building decentralized applications and why the future of the internet is more exciting than ever. The possibilities are endless! 🌐",
    type: "image",
    media: "/placeholder.svg?height=400&width=600",
    timestamp: "22 hours ago",
    likes: 567,
    comments: 123,
    shares: 67,
    tags: ["Web3", "Blockchain", "DeFi"],
    commentsData: [],
  },
];

export default function Postui() {
  const [posts, setPosts] = useState(
    staticPosts.map((post) => ({
      id: post.id.toString(),
      user: {
        _id: post.user._id,
        name: post.user.name,
        username: post.user.title.toLowerCase().replace(/\s+/g, "_"),
        avatar: post.user.avatar,
        verified: post.user.verified,
      },
      content: post.content,
      type: post.type,
      media: post.media,
      timestamp: post.timestamp,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      tags: post.tags,
      commentsData: post.commentsData,
      isStatic: true,
    }))
  );
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [playingVideo, setPlayingVideo] = useState(null);
  const [mutedVideos, setMutedVideos] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState([]);

  const userId = "68513ba087655694a9350b1"; // Current user ID for likes/comments
  const currentUserId = "68513ba087655694a9350b1b"; // Current user ID for following
  const API_BASE_URL = "https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev";

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/${currentUserId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch following: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Following data:", data);
        setFollowing(data.data?.user?.following || []);
      } catch (err) {
        console.error("Error fetching following:", err.message);
        setError(err.message);
      }
    };

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/post/feed`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} ${errorText}`);
        }
        const backendPosts = await response.json();
        console.log("Backend posts:", backendPosts);
        if (!Array.isArray(backendPosts)) {
          console.warn("Backend posts is not an array:", backendPosts);
          return;
        }

        const normalizedBackendPosts = backendPosts.map((post) => ({
          id: post._id,
          user: {
            _id: post.user?._id || "unknown",
            name: post.user?.name || "Unknown User",
            username: post.user?.username || "unknown",
            avatar: post.user?.avatar || "/placeholder-user.jpg",
            verified: post.user?.verified || false,
          },
          content: post.content || "",
          type: post.type || "text",
          media: post.media,
          timestamp: post.createdAt
            ? new Date(post.createdAt).toLocaleString()
            : "Unknown time",
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
          shares: post.shares || 0,
          tags: post.tags || [],
          commentsData: (post.comments || []).map((comment) => ({
            id: comment._id,
            text: comment.text || "",
            user: {
              _id: comment.user?._id || "unknown",
              name: comment.user?.name || "Unknown User",
              username: comment.user?.username || "unknown",
              avatar: comment.user?.avatar || "/placeholder-user.jpg",
              verified: comment.user?.verified || false,
            },
            createdAt: comment.createdAt || new Date().toISOString(),
            parentComment: comment.parentComment || null,
          })),
          isStatic: false,
        }));

        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((p) => p.id));
          const newPosts = normalizedBackendPosts.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prevPosts, ...newPosts];
        });
      } catch (err) {
        console.error("Fetch posts error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
    fetchPosts();
  }, []);

  const generateShareUrl = (postId) => {
    return `${window.location.origin}/post/${postId}`;
  };

  const handleShare = async (postId, content) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const shareUrl = generateShareUrl(postId);
    const shareData = {
      title: "Check out this post!",
      text: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
      url: shareUrl,
    };

    try {
      setPosts(
        posts.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p))
      );

      if (post.isStatic) {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
          alert("Link copied to clipboard!");
        } else {
          alert("Copy this link: " + shareUrl);
        }
        return;
      }

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        alert("Post shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }

      const response = await fetch(`${API_BASE_URL}/post/${postId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update share count");
      }

      const updatedPost = await response.json();
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, shares: updatedPost.shares || p.shares } : p
        )
      );
    } catch (err) {
      console.error("Share error:", err);
      setPosts(
        posts.map((p) => (p.id === postId ? { ...p, shares: p.shares - 1 } : p))
      );
      alert(`Failed to share post: ${err.message}`);
    }
  };

  const toggleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (post.isStatic) {
      const newLiked = new Set(likedPosts);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        setPosts(
          posts.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p))
        );
      } else {
        newLiked.add(postId);
        setPosts(
          posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        );
      }
      setLikedPosts(newLiked);
      return;
    }

    try {
      const newLiked = new Set(likedPosts);
      const isLiked = newLiked.has(postId);
      if (isLiked) {
        newLiked.delete(postId);
        setPosts(
          posts.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p))
        );
      } else {
        newLiked.add(postId);
        setPosts(
          posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        );
      }
      setLikedPosts(newLiked);

      const response = await fetch(`${API_BASE_URL}/post/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId:currentUserId, weight: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update like");
      }

      const updatedPost = await response.json();
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, likes: updatedPost.likes?.length || 0 } : p
        )
      );
    } catch (err) {
      console.error("Like error:", err);
      const newLiked = new Set(likedPosts);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        setPosts(
          posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        );
      } else {
        newLiked.add(postId);
        setPosts(
          posts.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p))
        );
      }
      setLikedPosts(newLiked);
      alert(`Failed to update like: ${err.message}`);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !commentText[postId]?.trim()) return;

    if (post.isStatic) {
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: p.comments + 1,
                commentsData: [
                  ...(p.commentsData || []),
                  {
                    id: `static-${Date.now()}`,
                    text: commentText[postId],
                    user: {
                      _id: "static-user",
                      name: "Current User",
                      username: "current_user",
                      avatar: "/placeholder-user.jpg",
                      verified: false,
                    },
                    createdAt: new Date().toISOString(),
                    parentComment: null,
                  },
                ],
              }
            : p
        )
      );
      setCommentText({ ...commentText, [postId]: "" });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: commentText[postId], userId: currentUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Comment error response:", errorData);
        throw new Error(errorData.error || "Failed to add comment");
      }

      const newComment = await response.json();
      console.log("New comment:", newComment);

      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: (p.comments || 0) + 1,
                commentsData: [
                  ...(p.commentsData || []),
                  {
                    id: newComment._id,
                    text: newComment.text || "",
                    user: {
                      _id: newComment.user?._id || "unknown",
                      name: newComment.user?.name || "Unknown User",
                      username: newComment.user?.username || "unknown",
                      avatar: newComment.user?.avatar || "/placeholder-user.jpg",
                      verified: newComment.user?.verified || false,
                    },
                    createdAt: newComment.createdAt || new Date().toISOString(),
                    parentComment: newComment.parentComment || null,
                  },
                ],
              }
            : p
        )
      );
      setCommentText({ ...commentText, [postId]: "" });
    } catch (err) {
      console.error("Comment error:", err);
      alert(`Failed to add comment: ${err.message}`);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${targetUserId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update follow status");
      }

      const data = await response.json();
      setFollowing(data.following || [...following, targetUserId]);
      alert(data.message || "Follow status updated");
    } catch (err) {
      console.error("Follow error:", err);
      alert(`Failed to update follow status: ${err.message}`);
    }
  };

  const toggleSave = (postId) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
    } else {
      newSaved.add(postId);
    }
    setSavedPosts(newSaved);
  };

  const toggleComments = (postId) => {
    const newComments = new Set(showComments);
    if (newComments.has(postId)) {
      newComments.delete(postId);
    } else {
      newComments.add(postId);
    }
    setShowComments(newComments);
  };

  if (error) return <div>Error: {error}</div>;
  if (posts.length === 0 && !loading) return <div>No posts available</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {loading && <div>Loading backend posts...</div>}
      {posts.map((post) => {
        const isFollowing = following.includes(post.user._id);
        return (
          <Card key={post.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {post.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{post.user.name}</h3>
                      {post.user.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.isStatic
                        ? post.user.username.replace(/_/g, " ")
                        : post.user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    {isFollowing && (
                      <p className="text-xs text-muted-foreground mt-1">follow</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!post.isStatic && (
                    <Button
                      variant={isFollowing ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleFollow(post.user._id)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {isFollowing ? "Following" : "Connect"}
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleSave(post.id)}>
                        {savedPosts.has(post.id) ? "Unsave post" : "Save post"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleShare(post.id, post.content)}
                      >
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem>Report post</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              {post.content && (
                <p className="text-sm leading-relaxed mb-3">{post.content}</p>
              )}

              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {post.media && (
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  {post.type === "video" ? (
                    <div className="relative">
                      <img
                        src={post.media || "/placeholder.svg"}
                        alt="Video thumbnail"
                        width={600}
                        height={400}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/60">
                        <Button
                          size="icon"
                          className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-black"
                          onClick={() =>
                            setPlayingVideo(
                              playingVideo === post.id ? null : post.id
                            )
                          }
                        >
                          {playingVideo === post.id ? (
                            <Pause className="h-8 w-8" />
                          ) : (
                            <Play className="h-8 w-8 ml-1" />
                          )}
                        </Button>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => {
                            const newMuted = new Set(mutedVideos);
                            if (newMuted.has(post.id)) {
                              newMuted.delete(post.id);
                            } else {
                              newMuted.add(post.id);
                            }
                            setMutedVideos(newMuted);
                          }}
                        >
                          {mutedVideos.has(post.id) ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : post.type === "document" ? (
                    <a
                      href={post.media}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-500 hover:underline"
                    >
                      View Document: {post.media.split("/").pop()}
                    </a>
                  ) : (
                    <img
                      src={post.media || "/placeholder.svg"}
                      alt="Post image"
                      width={600}
                      height={400}
                      className="w-full aspect-video object-cover"
                    />
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-0">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 ${likedPosts.has(post.id) ? "text-red-500" : ""}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`}
                      />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleShare(post.id, post.content)}
                    >
                      <Share className="h-4 w-4" />
                      {post.shares}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={savedPosts.has(post.id) ? "text-blue-500" : ""}
                    onClick={() => toggleSave(post.id)}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${savedPosts.has(post.id) ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>

                {showComments.has(post.id) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>YO</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Write a comment..."
                            className="h-8"
                            value={commentText[post.id] || ""}
                            onChange={(e) =>
                              setCommentText({
                                ...commentText,
                                [post.id]: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCommentSubmit(post.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>

                      {post.commentsData?.length > 0 ? (
                        <div className="space-y-3 pl-11">
                          {post.commentsData.map((comment) => (
                            <div key={comment.id || comment._id} className="flex gap-3">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={comment.user?.avatar || "/placeholder-user.jpg"}
                                />
                                <AvatarFallback>
                                  {comment.user?.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("") || "UN"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted rounded-lg p-2">
                                  <p className="text-sm font-medium">
                                    {comment.user?.name || "Unknown User"}
                                  </p>
                                  <p className="text-sm">{comment.text || ""}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {comment.likes?.length || 0}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                  >
                                    Reply
                                  </Button>
                                  <span className="text-xs text-muted-foreground">
                                    {comment.createdAt
                                      ? new Date(comment.createdAt).toLocaleTimeString()
                                      : "Unknown time"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground pl-11">
                          No comments yet.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}