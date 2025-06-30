import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Github } from "lucide-react";
import { toast } from "sonner"; // ✅ using sonner instead of ShadCN

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: [],
    features: [],
    lookingFor: [],
    githubLink: "",
    files: [],
  });

  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [lookingForInput, setLookingForInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (field, input, setInput, e) => {
    if (input.trim() && (e.key === "Enter" || e.type === "click")) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], input.trim()],
      }));
      setInput("");
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("technologies", JSON.stringify(formData.technologies));
    data.append("features", JSON.stringify(formData.features));
    data.append("lookingFor", JSON.stringify(formData.lookingFor));
    data.append("githubLink", formData.githubLink);
    formData.files.forEach((file) => data.append("files", file));
    data.append("user", "684ff0364ab94bd6ad1006ad"); // replace with actual user ID

    try {
      const response = await fetch("https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/projects", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        toast.success("🎉 Project created successfully!");
        setFormData({
          title: "",
          description: "",
          technologies: [],
          features: [],
          lookingFor: [],
          githubLink: "",
          files: [],
        });
      } else {
        const error = await response.json();
        toast.error(`🚫 Error: ${error.message}`);
      }
    } catch (error) {
      toast.error("❌ Failed to create project");
    }
  };

  return (
    <motion.div
      className="relative max-w-2xl mx-auto p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500 to-blue-950 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        <div>
          <Label htmlFor="title" className="text-blue-600">Project Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            className="border-blue-200 dark:border-blue-800"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-blue-600">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your project"
            className="border-blue-200 dark:border-blue-800"
            rows={4}
            required
          />
        </div>

        {/** Technologies */}
        <div>
          <Label htmlFor="technologies" className="text-blue-600">Technologies</Label>
          <div className="flex gap-2">
            <Input
              id="technologies"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => handleArrayInput("technologies", techInput, setTechInput, e)}
              placeholder="Add technology (press Enter)"
              className="border-blue-200 dark:border-blue-800"
            />
            <Button
              type="button"
              onClick={(e) => handleArrayInput("technologies", techInput, setTechInput, e)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Add
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
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

        {/** Features */}
        <div>
          <Label htmlFor="features" className="text-blue-600">Features</Label>
          <div className="flex gap-2">
            <Input
              id="features"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => handleArrayInput("features", featureInput, setFeatureInput, e)}
              placeholder="Add feature (press Enter)"
              className="border-blue-200 dark:border-blue-800"
            />
            <Button
              type="button"
              onClick={(e) => handleArrayInput("features", featureInput, setFeatureInput, e)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Add
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
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

        {/** Looking For */}
        <div>
          <Label htmlFor="lookingFor" className="text-blue-600">Looking For</Label>
          <div className="flex gap-2">
            <Input
              id="lookingFor"
              value={lookingForInput}
              onChange={(e) => setLookingForInput(e.target.value)}
              onKeyDown={(e) => handleArrayInput("lookingFor", lookingForInput, setLookingForInput, e)}
              placeholder="Add role (press Enter)"
              className="border-blue-200 dark:border-blue-800"
            />
            <Button
              type="button"
              onClick={(e) => handleArrayInput("lookingFor", lookingForInput, setLookingForInput, e)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Add
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
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

        {/** GitHub */}
        <div>
          <Label htmlFor="githubLink" className="text-blue-600">GitHub Link</Label>
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-blue-600" />
            <Input
              id="githubLink"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repository"
              className="border-blue-200 dark:border-blue-800"
            />
          </div>
        </div>

        {/** File Upload */}
        <div>
          <Label htmlFor="files" className="text-blue-600">Upload Files (max 10MB each)</Label>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
              className="border-blue-200 dark:border-blue-800"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.files.map((file, index) => (
              <Badge key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                {file.name}
                <X
                  className="ml-1 w-3 h-3 cursor-pointer"
                  onClick={() => removeFile(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-2xl"
        >
          Create Project
        </Button>
      </form>
    </motion.div>
  );
};

export default AddProjectForm;
