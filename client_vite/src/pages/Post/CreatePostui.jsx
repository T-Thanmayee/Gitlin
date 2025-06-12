"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileTextIcon, XIcon } from "lucide-react"
import axios from "axios"

export default function CreatePostui() {
  const [activeTab, setActiveTab] = useState("text")
  const [postContent, setPostContent] = useState("")
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaUrl, setMediaUrl] = useState("")
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const userId = "6849676869aeaef02fcc09bb" // Mocked userId (Sarah Chen)
  const baseUrl = "https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev"

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setMediaFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      if (activeTab === "document") {
        if (!mediaFile) {
          throw new Error("Document file is required")
        }
        const formData = new FormData()
        formData.append("userId", userId)
        formData.append("content", postContent || "Document upload")
        formData.append("type", activeTab)
        formData.append("tags", JSON.stringify(tags))
        formData.append("file", mediaFile)

        const response = await axios.post(`${baseUrl}/post/doc`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        setSuccess("Document post created successfully!")
      } else {
        if (!postContent.trim() && !mediaUrl.trim()) {
          throw new Error("Content or media URL is required")
        }
        const response = await axios.post(`${baseUrl}/post`, {
          userId,
          content: postContent || null,
          media: mediaUrl || null,
          type: activeTab,
          tags,
        })

        setSuccess("Post created successfully!")
      }

      setPostContent("")
      setMediaFile(null)
      setMediaUrl("")
      setTags([])
      setNewTag("")
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Sarah Chen</p>
              <p className="text-sm text-muted-foreground">Create a post</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-1">
                <FileTextIcon className="w-4 h-4" />
                <span>Text</span>
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center gap-1">
                <FileTextIcon className="w-4 h-4" />
                <span>Document</span>
              </TabsTrigger>
            </TabsList>

            {/* Text Post */}
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="text-content">What's on your mind?</Label>
                <Textarea
                  id="text-content"
                  placeholder="Share your thoughts..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>
              <div>
                <Label htmlFor="media-url">Media URL (optional)</Label>
                <Input
                  id="media-url"
                  placeholder="e.g., http://example.com/image.jpg"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <XIcon className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || (!postContent.trim() && !mediaUrl.trim())}
              >
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </TabsContent>

            {/* Document Post */}
            <TabsContent value="document" className="space-y-4">
              <div>
                <Label htmlFor="doc-content">Document Description</Label>
                <Textarea
                  id="doc-content"
                  placeholder="Describe what this document contains..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>
              <div>
                <Label htmlFor="doc-upload">Upload Document</Label>
                <Input
                  id="doc-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                {mediaFile && <p className="text-sm mt-2">Selected: {mediaFile.name}</p>}
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <XIcon className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={isLoading || !mediaFile}>
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}