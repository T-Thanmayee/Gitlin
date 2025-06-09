

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Code,
  Heart,
} from "lucide-react"

// Sample data
const sampleProfileData = {
  personal: {
    name: "Alexander Thompson",
    title: "Senior Software Engineer",
    company: "TechInnovate Solutions",
    location: "Seattle, WA",
    email: "alex.thompson@example.com",
    phone: "(555) 987-6543",
    website: "alexthompson.dev",
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=300&width=1200",
    bio: "Passionate software engineer with over 8 years of experience building scalable web applications and distributed systems. Specializing in React, Node.js, and cloud architecture.",
    joinDate: "January 2020",
  },
  education: [
    {
      institution: "University of Washington",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2014",
      endDate: "2016",
      description: "Focused on distributed systems and machine learning. Thesis on scalable real-time data processing.",
    },
    {
      institution: "California Institute of Technology",
      degree: "Bachelor of Science",
      field: "Computer Engineering",
      startDate: "2010",
      endDate: "2014",
    },
  ],
  experience: [
    {
      company: "TechInnovate Solutions",
      title: "Senior Software Engineer",
      location: "Seattle, WA",
      startDate: "Jan 2020",
      endDate: "Present",
      description:
        "Lead developer for cloud-based enterprise solutions. Architected and implemented microservices infrastructure using Node.js, Docker, and Kubernetes. Reduced system latency by 40% and improved scalability.",
    },
    {
      company: "DataViz Corp",
      title: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jun 2016",
      endDate: "Dec 2019",
      description:
        "Developed data visualization tools and dashboards using React and D3.js. Implemented real-time data processing pipelines with Apache Kafka and Spark.",
    },
    {
      company: "StartupXYZ",
      title: "Junior Developer",
      location: "Portland, OR",
      startDate: "Jul 2014",
      endDate: "May 2016",
      description: "Full-stack development for a SaaS platform. Built features using Ruby on Rails and Angular.js.",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "GraphQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
    "System Design",
    "Microservices",
    "CI/CD",
    "Agile Methodologies",
  ],
  posts: [
    {
      id: "post1",
      title: "Optimizing React Performance: Advanced Techniques",
      content:
        "In this article, I'll share some advanced techniques for optimizing React applications that go beyond the usual memoization advice. We'll explore code splitting, virtualization for long lists, and strategic state management.",
      date: "2 weeks ago",
      likes: 243,
      comments: 57,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "post2",
      title: "Building Resilient Microservices with Node.js",
      content:
        "Microservices architecture offers many benefits, but also introduces complexity. Here's how we built a resilient microservices system using Node.js, with circuit breakers, retries, and proper error handling.",
      date: "1 month ago",
      likes: 189,
      comments: 42,
    },
    {
      id: "post3",
      title: "From Monolith to Microservices: Our Journey",
      content:
        "Breaking down a monolithic application into microservices is challenging. In this post, I share our team's experience, the challenges we faced, and the strategies that worked for us.",
      date: "2 months ago",
      likes: 312,
      comments: 78,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "post4",
      title: "GraphQL vs REST: When to Use Each",
      content:
        "Both GraphQL and REST have their place in modern API development. This article compares the two approaches and provides guidance on when to choose one over the other.",
      date: "3 months ago",
      likes: 276,
      comments: 63,
    },
    {
      id: "post5",
      title: "Implementing Authentication with JWT",
      content:
        "JSON Web Tokens (JWT) provide a compact and self-contained way for securely transmitting information. Here's a step-by-step guide to implementing authentication with JWT in your application.",
      date: "4 months ago",
      likes: 198,
      comments: 45,
    },
    {
      id: "post6",
      title: "Continuous Deployment with GitHub Actions",
      content:
        "GitHub Actions makes it easy to automate your software workflows. Learn how to set up a continuous deployment pipeline for your web applications using this powerful tool.",
      date: "5 months ago",
      likes: 167,
      comments: 38,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "post7",
      title: "Managing State in React: Beyond Redux",
      content:
        "While Redux has been the go-to state management solution for React applications, there are now many alternatives. This post explores Context API, Recoil, Zustand, and other modern approaches.",
      date: "6 months ago",
      likes: 231,
      comments: 52,
    },
    {
      id: "post8",
      title: "Serverless Architecture: Pros and Cons",
      content:
        "Serverless computing is gaining popularity, but is it right for your project? This article discusses the advantages and limitations of serverless architecture based on real-world experience.",
      date: "7 months ago",
      likes: 204,
      comments: 47,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "post9",
      title: "TypeScript Best Practices for Large Projects",
      content:
        "TypeScript can greatly improve code quality and developer experience, especially in large projects. Here are some best practices we've developed after using TypeScript in production for years.",
      date: "8 months ago",
      likes: 287,
      comments: 64,
    },
    {
      id: "post10",
      title: "Optimizing Docker Containers for Production",
      content:
        "Docker containers are lightweight by design, but there are still many optimizations you can make for production environments. This guide covers multi-stage builds, proper base images, and security considerations.",
      date: "9 months ago",
      likes: 193,
      comments: 41,
    },
  ],
  projects: [
    {
      id: "project1",
      title: "CloudScale Analytics Platform",
      description:
        "A scalable analytics platform that processes terabytes of data in real-time. Built with a microservices architecture using Node.js, Kafka, and Elasticsearch, deployed on Kubernetes.",
      technologies: ["Node.js", "Kafka", "Elasticsearch", "Kubernetes", "React"],
      image: "/placeholder.svg?height=200&width=400",
      link: "https://github.com/example/cloudscale",
    },
    {
      id: "project2",
      title: "DevOps Automation Toolkit",
      description:
        "A collection of tools and scripts for automating CI/CD pipelines, infrastructure provisioning, and monitoring. Includes integrations with GitHub Actions, Terraform, and Prometheus.",
      technologies: ["Python", "Bash", "Terraform", "Docker", "GitHub Actions"],
      link: "https://github.com/example/devops-toolkit",
    },
    {
      id: "project3",
      title: "Distributed Task Scheduler",
      description:
        "A fault-tolerant distributed task scheduler with support for cron-like scheduling, retries, and dead-letter queues. Built with Go and Redis.",
      technologies: ["Go", "Redis", "gRPC", "Protocol Buffers"],
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "project4",
      title: "React Component Library",
      description:
        "A comprehensive library of React components with a focus on accessibility and performance. Includes form elements, navigation, modals, and data visualization components.",
      technologies: ["React", "TypeScript", "Storybook", "Jest", "CSS-in-JS"],
      link: "https://github.com/example/react-components",
    },
    {
      id: "project5",
      title: "E-commerce API",
      description:
        "A RESTful API for e-commerce applications with support for products, orders, payments, and user management. Includes comprehensive documentation and test suite.",
      technologies: ["Node.js", "Express", "MongoDB", "Stripe API", "JWT"],
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "project6",
      title: "Real-time Collaboration Tool",
      description:
        "A web-based collaboration tool with real-time document editing, chat, and presence indicators. Uses WebSockets for real-time communication and CRDTs for conflict resolution.",
      technologies: ["React", "Socket.io", "Node.js", "MongoDB", "Redis"],
      link: "https://github.com/example/collab-tool",
    },
    {
      id: "project7",
      title: "Mobile Fitness App",
      description:
        "A cross-platform mobile app for fitness tracking with workout plans, progress tracking, and social features. Built with React Native and Firebase.",
      technologies: ["React Native", "Firebase", "Redux", "Expo"],
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "project8",
      title: "Content Management System",
      description:
        "A headless CMS with a GraphQL API and a React-based admin interface. Supports content modeling, versioning, and publishing workflows.",
      technologies: ["Node.js", "GraphQL", "PostgreSQL", "React", "Apollo"],
      link: "https://github.com/example/headless-cms",
    },
    {
      id: "project9",
      title: "Blockchain Explorer",
      description:
        "A web application for exploring blockchain data with transaction visualization, address lookups, and real-time updates. Supports multiple cryptocurrencies.",
      technologies: ["React", "Web3.js", "Node.js", "D3.js", "WebSockets"],
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "project10",
      title: "Machine Learning Pipeline",
      description:
        "An end-to-end pipeline for training, evaluating, and deploying machine learning models. Includes data preprocessing, feature engineering, and model serving components.",
      technologies: ["Python", "TensorFlow", "Scikit-learn", "Docker", "Kubernetes"],
      link: "https://github.com/example/ml-pipeline",
    },
  ],
}

export function DetailedProfile({ data = sampleProfileData }) {
  const [activeTab, setActiveTab] = useState("about")

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cover Image and Profile Header */}
      <div className="relative mb-6 overflow-hidden rounded-xl">
        <div
          className="h-64 w-full bg-cover bg-center sm:h-80"
          style={{ backgroundImage: `url(${data.personal.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
              <AvatarImage src={data.personal.avatar || "/placeholder.svg"} alt={data.personal.name} />
              <AvatarFallback>{data.personal.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{data.personal.name}</h1>
              <p className="text-lg text-muted-foreground">
                {data.personal.title} at {data.personal.company}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{data.personal.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>Joined {data.personal.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 sm:mt-0">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button >
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
              <p className="text-sm text-muted-foreground">{data.personal.bio}</p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {data.personal.title} at {data.personal.company}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{data.personal.location}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${data.personal.email}`} className="text-primary hover:underline">
                    {data.personal.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{data.personal.phone}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://${data.personal.website}`}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.personal.website}
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
                {data.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-muted-foreground/20 pl-4">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                      <h3 className="font-medium">{edu.institution}</h3>
                    </div>
                    <p className="text-sm">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.description && <p className="mt-1 text-sm text-muted-foreground">{edu.description}</p>}
                  </div>
                ))}
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
                <Code className="mr-2 h-4 w-4" />
                Projects
              </TabsTrigger>
            </TabsList>

            {/* Experience Tab */}
            <TabsContent value="about" className="space-y-6">
              <h2 className="text-2xl font-semibold">Work Experience</h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-6">
                    <div className="relative">
                      <div className="absolute -left-[30px] h-5 w-5 rounded-full border-2 border-primary bg-background"></div>
                      <h3 className="text-lg font-medium">{exp.title}</h3>
                      <div className="flex items-center text-muted-foreground">
                        <Briefcase className="mr-1 h-4 w-4" />
                        <span>{exp.company}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{exp.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {exp.startDate} - {exp.endDate}
                      </p>
                      <p className="mt-2">{exp.description}</p>
                    </div>
                  </div>
                ))}
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
                {data.posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    {post.image && (
                      <div
                        className="h-48 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                    )}
                    <CardContent className={`p-4 ${!post.image ? "pt-4" : ""}`}>
                      <h3 className="text-lg font-medium">{post.title}</h3>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                      <p className="mt-2 line-clamp-3 text-sm">{post.content}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Heart className="mr-1 h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                {data.projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    {project.image && (
                      <div
                        className="h-48 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{project.title}</h3>
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
                      <p className="mt-2 line-clamp-3 text-sm">{project.description}</p>

                      <div className="mt-4 flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="font-normal">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}