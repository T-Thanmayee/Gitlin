import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner"; // ✅ use sonner toast
import CollabCard from "./CollabCard";

const RecommendedProjectsPage = () => {
  const userId  = "68513ba087655694a9350b1b"

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/projects/recommend/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setProjects(data.projects);
        } else {
          toast.error(data.message || "Failed to fetch recommended projects");
        }
      } catch (error) {
        toast.error("Failed to fetch recommended projects");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedProjects();
  }, [userId]);

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
        <h2 className="text-2xl font-bold text-blue-600 mb-8">Recommended Projects</h2>
        {loading ? (
          <div className="text-center text-blue-600">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <CollabCard
                  key={project._id}
                  project={{
                    id: project._id,
                    title: project.title,
                    description: project.description,
                    technologies: project.technologies,
                    features: project.features,
                    lookingFor: project.lookingFor,
                    githubLink: project.githubLink,
                    owner: project.owner,
                    collaborators: project.collaborators,
                  }}
                />
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
                No recommended projects found
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecommendedProjectsPage;
