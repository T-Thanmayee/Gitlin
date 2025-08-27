import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  GraduationCap,
  FileText,
  MessageSquare,
  Share2,
  BookOpen,
  Pencil,
  Heart,
  Share,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ThumbsUp,
  Send,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import CollabCard from "../Project_Folder/CollabCard";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev';

export function DetailedProfile({ data, userId, currentUserId }) {
  const [activeTab, setActiveTab] = useState("about");
  const [isMentor, setIsMentor] = useState(false);
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [commentText, setCommentText] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);
  const [mutedVideos, setMutedVideos] = useState(new Set());

  const profileData = {
    personal: data?.personal || {},
    education: data?.education || [],
    experience: data?.experience || [],
    skills: data?.skills || [],
    posts: data?.posts || [],
    projects: data?.projects || [],
  };

  useEffect(() => {
    if (currentUserId === userId) {
      axios
        .get(`${API_URL}/is-mentor/${userId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('Token')}` },
        })
        .then((response) => {
          setIsMentor(response.data.isMentor || false);
        })
        .catch((error) => {
          console.error("Error checking mentor status:", error);
        });
    }
  }, [userId, currentUserId]);

  const handleFollow = (userId) => {
    setFollowing((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleLike = (postId) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
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

  const handleCommentSubmit = (postId) => {
    console.log(`Submitting comment for post ${postId}: ${commentText[postId]}`);
    setCommentText({ ...commentText, [postId]: '' });
  };

  const handleShare = (postId, content) => {
    console.log(`Sharing post ${postId}: ${content}`);
  };

  const handleRegisterAsMentor = () => {
    navigate('/registermentor');
  };

  const handleViewMentorMessages = () => {
    navigate('/mentormessages');
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative mb-6 overflow-hidden rounded-xl">
        <div
          className="h-64 w-full bg-cover bg-center sm:h-80"
          style={{
            backgroundImage: `url(${
              profileData.personal.coverImage || '/placeholder.svg?height=300&width=1200'
            })`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
              <AvatarImage src={profileData.personal.avatar || '/placeholder.svg'} alt={profileData.personal.name || ''} />
              <AvatarFallback>{profileData.personal.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {profileData.personal.name || 'Unknown User'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {profileData.personal.title || 'No Title'} at{' '}
                {profileData.personal.company || 'No Company'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{profileData.personal.location || 'Unknown Location'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>Joined {profileData.personal.joinDate || 'Unknown'}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              {currentUserId === userId && (
                <Button variant="outline" onClick={() => navigate(`/edit/${currentUserId}`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
              {currentUserId !== userId && (
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              )}
              {currentUserId === userId && (
                !isMentor ? (
                  <Button variant="outline" onClick={handleRegisterAsMentor}>
                    Register as Mentor
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleViewMentorMessages}>
                    View Mentor Messages
                  </Button>
                )
              )}
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">About</h2>
              <p className="text-sm text-muted-foreground">
                {profileData.personal.bio || 'No bio available.'}
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {profileData.personal.title || 'No Title'} at{' '}
                    {profileData.personal.company || 'No Company'}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{profileData.personal.location || 'No Location'}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${profileData.personal.email || ''}`} className="text-primary hover:underline">
                    {profileData.personal.email || 'No Email'}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{profileData.personal.phone || 'No Phone'}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={profileData.personal.website ? `https://${profileData.personal.website}` : '#'}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profileData.personal.website || 'No Website'}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.length > 0 ? (
                  profileData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="font-normal">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Education</h2>
              <div className="space-y-4">
                {profileData.education.length > 0 ? (
                  profileData.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-muted-foreground/20 pl-4">
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                        <h3 className="font-medium">{edu.institution || ''}</h3>
                      </div>
                      <p className="text-sm">{edu.degree || ''} in {edu.field || ''}</p>
                      <p className="text-xs text-muted-foreground">{edu.startDate || ''} - {edu.endDate || ''}</p>
                      {edu.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{edu.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No education listed.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="about">
                <FileText className="mr-2 h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="posts">
                <BookOpen className="mr-2 h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="projects">
                <Globe className="mr-2 h-4 w-4" />
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <h2 className="text-2xl font-semibold">Work Experience</h2>
              <div className="space-y-6">
                {profileData.experience.length > 0 ? (
                  profileData.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-6">
                      <div className="relative">
                        <div className="absolute -left-[30px] h-5 w-5 rounded-full border-2 border-primary bg-background"></div>
                        <h3 className="text-lg font-medium">{exp.title || ''}</h3>
                        <div className="flex items-center text-muted-foreground">
                          <Briefcase className="mr-1 h-4 w-4" />
                          <span>{exp.company || ''}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>{exp.location || ''}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{exp.startDate || ''} - {exp.endDate || ''}</p>
                        <p className="mt-2">{exp.description || ''}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No experience listed.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="posts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Recent Posts</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="max-w-2xl mx-auto p-4 space-y-6">
                {profileData.posts.length > 0 ? (
                  profileData.posts.map((post) => {
                    const isFollowing = following.includes(post.user?._id);
                    return (
                      <Card key={post.id} className="w-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={post.user?.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {post.user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{post.user?.name || "Unknown User"}</h3>
                                  {post.user?.verified && (
                                    <Badge variant="secondary" className="text-xs">✓ Verified</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {post.isStatic ? post.user?.username?.replace(/_/g, " ") || "Unknown" : post.user?.username || "Unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {post.timestamp || new Date().toLocaleDateString()}
                                </p>
                                {isFollowing && (
                                  <p className="text-xs text-muted-foreground mt-1">follow</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          {post.content && <p className="text-sm leading-relaxed mb-3">{post.content}</p>}
                          {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
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
                                        const newMuted = new Set(mutedVideos);
                                        if (newMuted.has(post.id)) {
                                          newMuted.delete(post.id);
                                        } else {
                                          newMuted.add(post.id);
                                        }
                                        setMutedVideos(newMuted);
                                      }}
                                    >
                                      {mutedVideos.has(post.id) ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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
                                  className={`gap-3 ${likedPosts.has(post.id) ? "text-red-500" : ""}`}
                                  onClick={() => toggleLike(post.id)}
                                >
                                  <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                                  {post.likes || 0}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-3"
                                  onClick={() => toggleComments(post.id)}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  {post.comments || 0}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-3"
                                  onClick={() => handleShare(post.id, post.content)}
                                >
                                  <Share className="h-4 w-4" />
                                  {post.shares || 0}
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
                                      <Input
                                        placeholder="Write a comment..."
                                        className="h-8"
                                        value={commentText[post.id] || ""}
                                        onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                                      />
                                    </div>
                                    <Button size="icon" className="h-8 w-8" onClick={() => handleCommentSubmit(post.id)}>
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {post.commentsData?.length > 0 ? (
                                    <div className="space-y-3 pl-11">
                                      {post.commentsData.map((comment) => (
                                        <div key={comment.id || comment._id} className="flex gap-3">
                                          <Avatar className="w-6 h-6">
                                            <AvatarImage src={comment.user?.avatar || "/placeholder-user.jpg"} />
                                            <AvatarFallback>
                                              {comment.user?.name?.split(" ").map((n) => n[0]).join("") || "UN"}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="bg-muted rounded-lg p-2">
                                              <p className="text-sm font-medium">{comment.user?.name || "Unknown User"}</p>
                                              <p className="text-sm">{comment.text || ""}</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1">
                                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                {comment.likes?.length || 0}
                                              </Button>
                                              <Button variant="ghost" size="sm" className="h-6 text-xs">Reply</Button>
                                              <span className="text-xs text-muted-foreground">
                                                {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString() : "Unknown time"}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground pl-11">No comments yet.</p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No posts available.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="max-w-2xl mx-auto p-4 space-y-6">
                {profileData.projects.length > 0 ? (
                  profileData.projects.map((project) => (
                    <CollabCard
                      key={project._id}
                      project={{
                        title: project.title,
                        description: project.description,
                        technologies: project.technologies,
                        features: project.features,
                        lookingFor: project.lookingFor,
                        githubLink: project.githubLink,
                        owner: project.owner,
                      }}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No projects available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}