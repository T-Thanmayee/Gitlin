import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner"; // ✅ using sonner
import CollabCard from "./CollabCard";

const ProjectSearchPage = () => {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error("Search query is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/projects/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects);
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative max-w-7xl mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500 to-blue-950 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md mx-auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by title or description"
            className="border-blue-200 dark:border-blue-800"
          />
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>

        {loading ? (
          <div className="text-center text-blue-600">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
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
              <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
                No projects found
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectSearchPage;
