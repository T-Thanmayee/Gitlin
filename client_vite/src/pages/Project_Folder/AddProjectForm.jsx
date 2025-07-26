
import { useState, useCallback, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useSelector, useDispatch } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Github, Upload, X, Search, Filter } from "lucide-react"

const ProjectForm = ({ onSubmit, submitText, formData, setFormData, techInput, setTechInput, featureInput, setFeatureInput, lookingForInput, setLookingForInput, formRef }) => {
  const handleArrayInput = useCallback((field, input, setInput) => {
    if (input.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], input.trim()],
      }))
      setInput("")
    }
  }, [])

  const removeArrayItem = useCallback((field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }, [])

  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }))
  }, [])

  const removeFile = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }, [])

  return (
    <div ref={formRef} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-blue-600">Project Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter project title"
            className="border-blue-200 dark:border-blue-800"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-blue-600">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your project"
            className="border-blue-200 dark:border-blue-800"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github" className="text-blue-600">GitHub Link</Label>
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-blue-600" />
            <Input
              id="github"
              value={formData.githubLink}
              onChange={(e) => setFormData((prev) => ({ ...prev, githubLink: e.target.value }))}
              placeholder="https://github.com/username/repo"
              className="border-blue-200 dark:border-blue-800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-600">Technologies</Label>
          <div className="flex gap-2">
            <Input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Add technology (press Enter)"
              className="border-blue-200 dark:border-blue-800"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleArrayInput("technologies", techInput, setTechInput)
                }
              }}
            />
            <Button
              type="button"
              onClick={() => handleArrayInput("technologies", techInput, setTechInput)}
              className="bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <Badge key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                {tech}
                <X
                  className="ml-1 w-3 h-3 cursor-pointer"
                  onClick={() => removeArrayItem("technologies", index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-600">Features</Label>
          <div className="flex gap-2">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add feature (press Enter)"
              className="border-blue-200 dark:border-blue-800"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleArrayInput("features", featureInput, setFeatureInput)
                }
              }}
            />
            <Button
              type="button"
              onClick={() => handleArrayInput("features", featureInput, setFeatureInput)}
              className="bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <Badge key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                {feature}
                <X
                  className="ml-1 w-3 h-3 cursor-pointer"
                  onClick={() => removeArrayItem("features", index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-600">Looking For</Label>
          <div className="flex gap-2">
            <Input
              value={lookingForInput}
              onChange={(e) => setLookingForInput(e.target.value)}
              placeholder="Add role/skill needed (press Enter)"
              className="border-blue-200 dark:border-blue-800"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleArrayInput("lookingFor", lookingForInput, setLookingForInput)
                }
              }}
            />
            <Button
              type="button"
              onClick={() => handleArrayInput("lookingFor", lookingForInput, setLookingForInput)}
              className="bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.lookingFor.map((role, index) => (
              <Badge key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                {role}
                <X
                  className="ml-1 w-3 h-3 cursor-pointer"
                  onClick={() => removeArrayItem("lookingFor", index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-600">Files (Optional, max 10MB each)</Label>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="border-blue-200 dark:border-blue-800 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground"
            />
          </div>
          {formData.files.length > 0 && (
            <div className="space-y-1">
              {formData.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                  <span>{file.name}</span>
                  <X
                    className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => removeFile(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Button onClick={onSubmit} className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-2xl">
          {submitText}
        </Button>
      </div>
    </div>
  )
}

const AddProjectForm = () => {
   const { loginStatus, currentUser, errorOccured, errorMessage, isPending } = useSelector((state) => state.auth);
  const userId = currentUser._id // Replace with actual user ID from authentication
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTech, setSelectedTech] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: [],
    features: [],
    lookingFor: [],
    githubLink: "",
    files: [],
  })
  const [techInput, setTechInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [lookingForInput, setLookingForInput] = useState("")
  const editDialogRef = useRef(null)

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/projects/user/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('Token')}` // Include token if needed
            }
          }
        )
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        } else {
          toast.error("Failed to fetch user projects")
        }
      } catch (error) {
        toast.error("Error fetching user projects")
      }
    }
    fetchUserProjects()
  }, [userId])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTech = selectedTech === "" || project.technologies.includes(selectedTech)
    return matchesSearch && matchesTech
  })

  const allTechnologies = Array.from(new Set(projects.flatMap((p) => p.technologies)))

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      technologies: [],
      features: [],
      lookingFor: [],
      githubLink: "",
      files: [],
    })
    setTechInput("")
    setFeatureInput("")
    setLookingForInput("")
  }, [])

  const handleAddProject = useCallback(async () => {
    if (!formData.title.trim()) {
      toast.error("Project title is required")
      return
    }

    const data = new FormData()
    data.append("title", formData.title)
    data.append("description", formData.description)
    data.append("technologies", JSON.stringify(formData.technologies))
    data.append("features", JSON.stringify(formData.features))
    data.append("lookingFor", JSON.stringify(formData.lookingFor))
    data.append("githubLink", formData.githubLink)
    formData.files.forEach((file) => data.append("files", file))
    data.append("user", userId)

    try {
      const response = await fetch("https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/projects",
 {
        method: "POST",
        body: data,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('Token')}` // Include token if needed
        }
      })

      if (response.ok) {
        toast.success("🎉 Project created successfully!")
        const newProject = await response.json()
        setProjects([...projects, newProject])
        setIsAddDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(`🚫 Error: ${error.message}`)
      }
    } catch (error) {
      toast.error("❌ Failed to create project")
    }
  }, [formData, projects, resetForm, userId])

  const handleEditProject = useCallback(async () => {
    if (editingProject) {
      if (!formData.title.trim()) {
        toast.error("Project title is required")
        return
      }

      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("technologies", JSON.stringify(formData.technologies))
      data.append("features", JSON.stringify(formData.features))
      data.append("lookingFor", JSON.stringify(formData.lookingFor))
      data.append("githubLink", formData.githubLink)
      formData.files.forEach((file) => data.append("files", file))
      data.append("user", userId)

      try {
        const response = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/projects/${editingProject.id}`, {
          method: "PUT",
          body: data,
        })

        if (response.ok) {
          toast.success("🎉 Project updated successfully!")
          const updatedProject = await response.json()
          setProjects(projects.map((p) => (p.id === editingProject.id ? updatedProject : p)))
          setIsEditDialogOpen(false)
          setEditingProject(null)
          resetForm()
        } else {
          const error = await response.json()
          toast.error(`🚫 Error: ${error.message}`)
        }
      } catch (error) {
        toast.error("❌ Failed to update project")
      }
    }
  }, [editingProject, formData, projects, resetForm, userId])

  const handleDeleteProject = useCallback(async (id) => {
    try {
      const response = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/projects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("🗑️ Project deleted successfully!")
        setProjects(projects.filter((p) => p.id !== id))
      } else {
        const error = await response.json()
        toast.error(`🚫 Error: ${error.message}`)
      }
    } catch (error) {
      toast.error("❌ Failed to delete project")
    }
  }, [projects])

  const openEditDialog = useCallback((project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      features: project.features,
      lookingFor: project.lookingFor,
      githubLink: project.githubLink,
      files: project.files,
    })
    setIsEditDialogOpen(true)
    if (editDialogRef.current) {
      editDialogRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Manager</h1>
          <p className="text-muted-foreground">Manage your projects and collaborate with others</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>Create a new project and start collaborating with others.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <ProjectForm
                onSubmit={handleAddProject}
                submitText="Create Project"
                formData={formData}
                setFormData={setFormData}
                techInput={techInput}
                setTechInput={setTechInput}
                featureInput={featureInput}
                setFeatureInput={setFeatureInput}
                lookingForInput={lookingForInput}
                setLookingForInput={setLookingForInput}
                formRef={editDialogRef}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Technologies</option>
            {allTechnologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">{project.description}</CardDescription>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)} className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{project.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {project.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      {feature}
                    </Badge>
                  ))}
                  {project.features.length > 3 && (
                    <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      +{project.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Looking For</h4>
                <div className="flex flex-wrap gap-1">
                  {project.lookingFor.slice(0, 2).map((role, index) => (
                    <Badge key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      {role}
                    </Badge>
                  ))}
                  {project.lookingFor.length > 2 && (
                    <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      +{project.lookingFor.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                {project.githubLink ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">No GitHub link</span>
                )}

                {project.file && project.files.length > 0 && (
                  <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    {project.files.length} file{project.files.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent ref={editDialogRef} className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update your project details and requirements.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <ProjectForm
              onSubmit={handleEditProject}
              submitText="Update Project"
              formData={formData}
              setFormData={setFormData}
              techInput={techInput}
              setTechInput={setTechInput}
              featureInput={featureInput}
              setFeatureInput={setFeatureInput}
              lookingForInput={lookingForInput}
              setLookingForInput={setLookingForInput}
              formRef={editDialogRef}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default AddProjectForm
