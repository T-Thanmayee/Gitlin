"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
} from "lucide-react"


export default function Postui() {
  const [likedPosts, setLikedPosts] = useState(new Set());
      const [savedPosts, setSavedPosts] = useState(new Set());
      const [playingVideo, setPlayingVideo] = useState(null);
      const [mutedVideos, setMutedVideos] = useState(new Set());
      const [showComments, setShowComments] = useState(new Set());

  const toggleLike = (postId) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const toggleSave = (postId) => {
    const newSaved = new Set(savedPosts)
    if (newSaved.has(postId)) {
      newSaved.delete(postId)
    } else {
      newSaved.add(postId)
    }
    setSavedPosts(newSaved)
  }

  const toggleComments = (postId) => {
    const newComments = new Set(showComments)
    if (newComments.has(postId)) {
      newComments.delete(postId)
    } else {
      newComments.add(postId)
    }
    setShowComments(newComments)
  }

  const posts = [
    {
      id: 1,
      user: {
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
    },
    {
      id: 2,
      user: {
        name: "Alex Rodriguez",
        title: "Full Stack Developer",
        avatar: "/placeholder-user.jpg",
        verified: false,
      },
      content:
        "Building the future of web development with React Server Components! Here's a quick demo of the app I've been working on. The performance improvements are incredible! 💻✨",
      type: "video",
      media: "/placeholder.svg?height=400&width=600",
      timestamp: "4 hours ago",
      likes: 189,
      comments: 67,
      shares: 23,
      tags: ["React", "WebDev", "ServerComponents"],
    },
    {
      id: 3,
      user: {
        name: "Dr. Emily Watson",
        title: "AI Research Scientist at OpenAI",
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      content:
        "Excited to share our latest research on multimodal AI systems! This breakthrough could revolutionize how we interact with technology. The implications for accessibility and human-computer interaction are profound.",
      type: "image",
      media: "/placeholder.svg?height=400&width=600",
      timestamp: "6 hours ago",
      likes: 892,
      comments: 156,
      shares: 78,
      tags: ["AI", "Research", "Technology"],
    },
    {
      id: 4,
      user: {
        name: "Marcus Johnson",
        title: "UX Designer at Figma",
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      content:
        "Design systems are not just about consistency—they're about empowering teams to build better products faster. Here's what I learned from scaling our design system across 50+ product teams.",
      type: "text",
      timestamp: "8 hours ago",
      likes: 445,
      comments: 89,
      shares: 34,
      tags: ["DesignSystems", "UX", "Figma"],
    },
    {
      id: 5,
      user: {
        name: "Lisa Park",
        title: "Data Scientist at Netflix",
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      content:
        "Data visualization can tell powerful stories! Here's how we used machine learning to predict viewer preferences and improve content recommendations. The results speak for themselves 📊",
      type: "image",
      media: "/placeholder.svg?height=400&width=600",
      timestamp: "10 hours ago",
      likes: 567,
      comments: 123,
      shares: 45,
      tags: ["DataScience", "MachineLearning", "Netflix"],
    },
    {
      id: 6,
      user: {
        name: "David Kim",
        title: "Startup Founder & CEO",
        avatar: "/placeholder-user.jpg",
        verified: false,
      },
      content:
        "From idea to $1M ARR in 18 months! Here's the behind-the-scenes look at our journey building a SaaS platform. The ups, downs, and everything in between. Entrepreneurship is not for the faint of heart! 💪",
      type: "video",
      media: "/placeholder.svg?height=400&width=600",
      timestamp: "12 hours ago",
      likes: 1234,
      comments: 234,
      shares: 89,
      tags: ["Startup", "Entrepreneurship", "SaaS"],
    },
    {
      id: 7,
      user: {
        name: "Rachel Green",
        title: "Marketing Director at Shopify",
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      content:
        "The future of e-commerce is here! Our latest campaign generated 300% ROI using AI-powered personalization. Here's the strategy breakdown that every marketer needs to know.",
      type: "text",
      timestamp: "14 hours ago",
      likes: 678,
      comments: 145,
      shares: 67,
      tags: ["Marketing", "Ecommerce", "AI"],
    },
    {
      id: 8,
      user: {
        name: "James Wilson",
        title: "DevOps Engineer at AWS",
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      content:
        "Kubernetes at scale: lessons learned from managing 10,000+ containers in production. Here's our architecture and the tools that keep everything running smoothly ⚙️",
      type: "image",
      media: "/placeholder.svg?height=400&width=600",
      timestamp: "16 hours ago",
      likes: 456,
      comments: 98,
      shares: 56,
      tags: ["DevOps", "Kubernetes", "AWS"],
    },
    {
      id: 9,
      user: {
        name: "Anna Martinez",
        title: "Cybersecurity Specialist",
        avatar: "/placeholder-user.jpg",
        verified: false,
      },
      content:
        "Cybersecurity isn't just about technology—it's about people. Here's how we reduced security incidents by 80% through better training and awareness programs. Culture beats technology every time! 🔒",
      type: "text",
      timestamp: "18 hours ago",
      likes: 789,
      comments: 167,
      shares: 78,
      tags: ["Cybersecurity", "Training", "Culture"],
    },
    {
      id: 10,
      user: {
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
    },
    {
      id: 11,
      user: {
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
    },
    {
      id: 12,
      user: {
        name: "Michael Brown",
        title: "Cloud Architect at Microsoft",
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      content:
        "Serverless architecture changed everything for us! Here's how we reduced costs by 60% and improved performance by migrating to Azure Functions. The cloud revolution is real! ☁️",
      type: "text",
      timestamp: "1 day ago",
      likes: 432,
      comments: 87,
      shares: 34,
      tags: ["Serverless", "Azure", "CloudArchitecture"],
    },
  ]

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {posts.map((post) => (
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
                  <p className="text-sm text-muted-foreground">{post.user.title}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Save post</DropdownMenuItem>
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                  <DropdownMenuItem>Report post</DropdownMenuItem>
                  <DropdownMenuItem>Unfollow {post.user.name}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <p className="text-sm leading-relaxed mb-3">{post.content}</p>

            {post.tags && (
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-black"
                        onClick={() => setPlayingVideo(playingVideo === post.id ? null : post.id)}
                      >
                        {playingVideo === post.id ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                      </Button>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => {
                          const newMuted = new Set(mutedVideos)
                          if (newMuted.has(post.id)) {
                            newMuted.delete(post.id)
                          } else {
                            newMuted.add(post.id)
                          }
                          setMutedVideos(newMuted)
                        }}
                      >
                        {mutedVideos.has(post.id) ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
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
                    <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                    {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => toggleComments(post.id)}>
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
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
                  <Bookmark className={`h-4 w-4 ${savedPosts.has(post.id) ? "fill-current" : ""}`} />
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
                        <Input placeholder="Write a comment..." className="h-8" />
                      </div>
                      <Button size="icon" className="h-8 w-8">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sample Comments */}
                    <div className="space-y-3 pl-11">
                      <div className="flex gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-lg p-2">
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-sm">Great insights! Thanks for sharing this.</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              12
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              Reply
                            </Button>
                            <span className="text-xs text-muted-foreground">2h</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-lg p-2">
                            <p className="text-sm font-medium">Sarah Miller</p>
                            <p className="text-sm">This is exactly what I needed to read today!</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />8
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              Reply
                            </Button>
                            <span className="text-xs text-muted-foreground">1h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
