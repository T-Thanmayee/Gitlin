import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner"; // ✅ use sonner toast
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const AddCollaboratorForm = () => {
  const { projectId } = useParams();
  const [collaboratorId, setCollaboratorId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collaboratorId.trim()) {
      toast.error("Collaborator ID is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collaboratorId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Collaborator added successfully");
        setCollaboratorId("");
      } else {
        toast.error(data.message || "Failed to add collaborator");
      }
    } catch (error) {
      toast.error("Failed to add collaborator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative max-w-md mx-auto p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500 to-blue-950 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        <h2 className="text-xl font-bold text-blue-600">Add Collaborator</h2>
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <Input
              value={collaboratorId}
              onChange={(e) => setCollaboratorId(e.target.value)}
              placeholder="Enter collaborator user ID"
              className="border-blue-200 dark:border-blue-800"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-2xl"
          disabled={loading}
        >
          Add Collaborator
        </Button>
      </form>
    </motion.div>
  );
};

export default AddCollaboratorForm;
