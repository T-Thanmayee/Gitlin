"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ImageIcon,
  VideoIcon,
  FileTextIcon,
  CalendarIcon,
  BarChart3Icon,
  BriefcaseIcon,
  MapPinIcon,
  DollarSignIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import axios from "axios";

export default function CreatePostui() {
  const [activeTab, setActiveTab] = useState("text");
  const [postContent, setPostContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = "684ff902561fbc141c2f5137"; // Mocked userId (Sarah Chen)
  const baseUrl = "https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev";

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const updatePollOption = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (activeTab === "text") {
        if (!postContent.trim()) {
          throw new Error("Content is required");
        }
        const response = await axios.post(`${baseUrl}/post`, {
          userId,
          content: postContent,
          type: "text",
          tags,
        });
        setSuccess("Text post created successfully!");
      } else if (activeTab === "photo") {
        if (!mediaFile) {
          throw new Error("Image file is required");
        }
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("content", postContent || "Image upload");
        formData.append("tags", JSON.stringify(tags));
        formData.append("file", mediaFile);

        const response = await axios.post(`${baseUrl}/post/photo`, formData);
        setSuccess("Image post created successfully!");
      } else if (activeTab === "video") {
        if (!mediaFile) {
          throw new Error("Video file is required");
        }
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("content", postContent || "Video upload");
        formData.append("tags", JSON.stringify(tags));
        formData.append("file", mediaFile);

        const response = await axios.post(`${baseUrl}/post/video`, formData);
        setSuccess("Video post created successfully!");
      } else if (activeTab === "document") {
        if (!mediaFile) {
          throw new Error("Document file is required");
        }
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("content", postContent || "Document upload");
        formData.append("type", "document");
        formData.append("tags", JSON.stringify(tags));
        formData.append("file", mediaFile);

        const response = await axios.post(`${baseUrl}/post/doc`, formData);
        setSuccess("Document post created successfully!");
      } else {
        throw new Error("Other post types are not implemented yet");
      }

      setPostContent("");
      setMediaFile(null);
      setTags([]);
      setNewTag("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
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
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="text" className="flex items-center gap-1">
                <FileTextIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Photo</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-1">
                <VideoIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Video</span>
              </TabsTrigger>
              <TabsTrigger value="poll" className="flex items-center gap-1">
                <BarChart3Icon className="w-4 h-4" />
                <span className="hidden sm:inline">Poll</span>
              </TabsTrigger>
              <TabsTrigger value="event" className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Event</span>
              </TabsTrigger>
              <TabsTrigger value="job" className="flex items-center gap-1">
                <BriefcaseIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Job</span>
              </TabsTrigger>
              <TabsTrigger value="article" className="flex items-center gap-1">
                <FileTextIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Article</span>
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center gap-1">
                <FileTextIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Doc</span>
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
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !postContent.trim()}
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
                <Button variant="outline">Schedule</Button>
              </div>
            </TabsContent>

            {/* Photo Post */}
            <TabsContent value="photo" className="space-y-4">
              <div>
                <Label htmlFor="photo-content">Add a caption</Label>
                <Textarea
                  id="photo-content"
                  placeholder="What's this photo about?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>
              <div>
                <Label htmlFor="photo-upload">Upload Image</Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
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
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !mediaFile}
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </TabsContent>

            {/* Video Post */}
            <TabsContent value="video" className="space-y-4">
              <div>
                <Label htmlFor="video-content">Video description</Label>
                <Textarea
                  id="video-content"
                  placeholder="Tell us about your video..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>
              <div>
                <Label htmlFor="video-upload">Upload Video</Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/mp4,video/mpeg,video/webm"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                {mediaFile && <p className="text-sm mt-2">Selected: {mediaFile.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Video Settings</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-captions" />
                  <Label htmlFor="auto-captions">Generate automatic captions</Label>
                </div>
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
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !mediaFile}
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
                <Button variant="outline">Preview</Button>
              </div>
            </TabsContent>

            {/* Poll Post */}
            <TabsContent value="poll" className="space-y-4">
              <div>
                <Label htmlFor="poll-question">Poll Question</Label>
                <Input id="poll-question" placeholder="Ask a question..." className="mt-2" />
              </div>
              <div className="space-y-3">
                <Label>Poll Options</Label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                    />
                    {pollOptions.length > 2 && (
                      <Button variant="outline" size="icon" onClick={() => removePollOption(index)}>
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addPollOption} className="w-full">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Poll Duration</Label>
                <RadioGroup defaultValue="1-day">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-day" id="1-day" />
                    <Label htmlFor="1-day">1 Day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-days" id="3-days" />
                    <Label htmlFor="3-days">3 Days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-week" id="1-week" />
                    <Label htmlFor="1-week">1 Week</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex gap-2">
                <Button>Create Poll</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </TabsContent>

            {/* Event Post */}
            <TabsContent value="event" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input id="event-name" placeholder="Event title..." className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="event-date">Date & Time</Label>
                  <Input id="event-date" type="datetime-local" className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="event-location">Location</Label>
                <div className="flex gap-2 mt-2">
                  <MapPinIcon className="w-5 h-5 mt-2 text-muted-foreground" />
                  <Input id="event-location" placeholder="Event location or online link..." />
                </div>
              </div>
              <div>
                <Label htmlFor="event-description">Event Description</Label>
                <Textarea
                  id="event-description"
                  placeholder="Tell people about your event..."
                  className="min-h-[100px] mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <RadioGroup defaultValue="public">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public Event</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private Event</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex gap-2">
                <Button>Create Event</Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </TabsContent>

            {/* Job Post */}
            <TabsContent value="job" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input id="job-title" placeholder="e.g. Senior Software Engineer" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company name" className="mt-2" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="job-location">Location</Label>
                  <Input id="job-location" placeholder="City, State or Remote" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <div className="flex gap-2 mt-2">
                    <DollarSignIcon className="w-5 h-5 mt-2 text-muted-foreground" />
                    <Input id="salary" placeholder="e.g. $80k - $120k" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Describe the role, requirements, and benefits..."
                  className="min-h-[120px] mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <RadioGroup defaultValue="full-time">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-time" id="full-time" />
                    <Label htmlFor="full-time">Full-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="part-time" id="part-time" />
                    <Label htmlFor="part-time">Part-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contract" id="contract" />
                    <Label htmlFor="contract">Contract</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex gap-2">
                <Button>Post Job</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </TabsContent>

            {/* Article Post */}
            <TabsContent value="article" className="space-y-4">
              <div>
                <Label htmlFor="article-title">Article Title</Label>
                <Input id="article-title" placeholder="Write a compelling headline..." className="mt-2" />
              </div>
              <div>
                <Label htmlFor="article-subtitle">Subtitle (Optional)</Label>
                <Input id="article-subtitle" placeholder="Add a subtitle..." className="mt-2" />
              </div>
              <div>
                <Label htmlFor="article-content">Article Content</Label>
                <Textarea
                  id="article-content"
                  placeholder="Write your article content here..."
                  className="min-h-[200px] mt-2"
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
              <div className="flex gap-2">
                <Button>Publish Article</Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </TabsContent>

            {/* Document Post */}
            <TabsContent value="document" className="space-y-4">
              <div>
                <Label htmlFor="doc-title">Document Title</Label>
                <Input id="doc-title" placeholder="Give your document a title..." className="mt-2" />
              </div>
              <div>
                <Label htmlFor="doc-description">Description</Label>
                <Textarea
                  id="doc-description"
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
              <div className="space-y-2">
                <Label>Sharing Permissions</Label>
                <RadioGroup defaultValue="view">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="view" id="view" />
                    <Label htmlFor="view">View only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="download" id="download" />
                    <Label htmlFor="download">Allow download</Label>
                  </div>
                </RadioGroup>
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
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !mediaFile}
                >
                  {isLoading ? "Posting..." : "Share Document"}
                </Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}