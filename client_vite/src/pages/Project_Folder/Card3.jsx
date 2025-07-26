import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Github, Users, Code, Target, Clock, User } from "lucide-react"
import { useLocation, useParams } from "react-router-dom"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner"

export function Card3() {
  const location = useLocation()
  const { id } = useParams()
  const project = location.state?.project
  const { loginStatus, currentUser, errorOccured, errorMessage, isPending } = useSelector((state) => state.auth);
  const currentUserId = currentUser._id // Get current user ID from Redux state;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleJoinProject = async () => {
    try {
      const res = await axios.put(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/projects/${id}/${currentUserId}
        `,{},{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('Token')}` // Include token if needed
          }
        })
      toast.success("Successfully joined the project!")
      console.log("Joined:", res.data)
    } catch (err) {
      console.error("Error joining:", err)
      toast.error("Failed to join the project")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Actions</h2>
          <Button className="w-full mb-3" size="lg" onClick={handleJoinProject}>
            Join Project
          </Button>
          <Button variant="outline" className="w-full bg-transparent" size="sm">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Technologies</h3>
          <div className="space-y-2">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="w-full justify-start">
                <Code className="mr-2 h-3 w-3" />
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Looking For</h3>
          <div className="space-y-2">
            {project.lookingFor.map((role, index) => (
              <div key={index} className="flex items-center p-2 bg-green-50 rounded-md">
                <Users className="mr-2 h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">{role}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Project Info</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Owner: {project.owner?.slice(-8)}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>{project.collaborators.length} Collaborators</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Created: {formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>Updated: {formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Target className="mr-3 h-6 w-6 text-blue-600" />
                Key Features
              </h2>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Github className="mr-3 h-6 w-6 text-gray-700" />
                Repository Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">GitHub Link</label>
                  <p className="text-blue-600 hover:underline cursor-pointer break-all">
                    {project.githubLink}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Project ID</label>
                  <p className="text-gray-700 font-mono text-sm">{project._id}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Collaboration Opportunities</h2>
            <p className="text-gray-600 mb-4">
              This project is actively looking for contributors. Join our team and help build something amazing!
            </p>
            <div className="flex flex-wrap gap-2">
              {project.lookingFor.map((role, index) => (
                <Badge key={index} variant="outline" className="border-green-500 text-green-700">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

