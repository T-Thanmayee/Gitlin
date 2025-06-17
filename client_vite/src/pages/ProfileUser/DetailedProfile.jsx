import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  GraduationCap,
  Users,
  FileText,
  MessageSquare,
  Share2,
  BookOpen,
  Pencil,
} from "lucide-react";

export function DetailedProfile({ data, userId, currentUserId }) {
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  // Fallback for missing data
  const profileData = {
    personal: data?.personal || {},
    education: data?.education || [],
    experience: data?.experience || [],
    skills: data?.skills || [],
    posts: data?.posts || [],
    projects: data?.projects || [],
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cover Image and Profile Header */}
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
              <AvatarImage
                src={profileData.personal.avatar || '/placeholder.svg'}
                alt={profileData.personal.name || ''}
              />
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
              {currentUserId  && (
                <Button variant="outline" onClick={() => navigate(`/edit/${currentUserId}`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Connect
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar */}
        <div className="space-y-6 md:col-span-1">
          {/* About Card */}
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
                  <a
                    href={`mailto:${profileData.personal.email || ''}`}
                    className="text-primary hover:underline"
                  >
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
                    href={
                      profileData.personal.website
                        ? `https://${profileData.personal.website}`
                        : '#'
                    }
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

          {/* Skills Card */}
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

          {/* Education Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Education</h2>
              <div className="space-y-4">
                {profileData.education.length > 0 ? (
                  profileData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-muted-foreground/20 pl-4"
                    >
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                        <h3 className="font-medium">{edu.institution || ''}</h3>
                      </div>
                      <p className="text-sm">
                        {edu.degree || ''} in {edu.field || ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {edu.startDate || ''} - {edu.endDate || ''}
                      </p>
                      {edu.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {edu.description}
                        </p>
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

        {/* Main Content Area */}
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

            {/* Experience Tab */}
            <TabsContent value="about" className="space-y-6">
              <h2 className="text-2xl font-semibold">Work Experience</h2>
              <div className="space-y-6">
                {profileData.experience.length > 0 ? (
                  profileData.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary/30 pl-6"
                    >
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
                        <p className="text-sm text-muted-foreground">
                          {exp.startDate || ''} - {exp.endDate || ''}
                        </p>
                        <p className="mt-2">{exp.description || ''}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No experience listed.</p>
                )}
              </div>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Recent Posts</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {profileData.posts.length > 0 ? (
                  profileData.posts.map((post) => (
                    <Card key={post._id} className="overflow-hidden">
                      {post.image && (
                        <div
                          className="h-48 w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${post.image})` }}
                        />
                      )}
                      <CardContent className={`p-4 ${!post.image ? 'pt-4' : ''}`}>
                        <h3 className="text-lg font-medium">{post.title || ''}</h3>
                        <p className="text-xs text-muted-foreground">
                          {post.date ? new Date(post.date).toLocaleDateString() : 'Unknown Date'}
                        </p>
                        <p className="mt-2 line-clamp-3 text-sm">{post.content || ''}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              <span>{post.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              <span>{post.comments?.length || 0}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No posts available.</p>
                )}
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {profileData.projects.length > 0 ? (
                  profileData.projects.map((project) => (
                    <Card key={project._id} className="overflow-hidden">
                      {project.image && (
                        <div
                          className="h-48 w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${project.image})` }}
                        />
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{project.title || ''}</h3>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-3 text-sm">{project.description || ''}</p>
                        <div className="mt-4 flex flex-wrap gap-1">
                          {project.technologies?.length > 0 ? (
                            project.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="font-normal">
                                {tech}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No technologies listed.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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