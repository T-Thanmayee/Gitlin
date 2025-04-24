import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  ChevronRight,
  Code,
  ExternalLink,
  Eye,
  Github,
  Globe,
  Lightbulb,
  Rocket,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
function CollabCard() {
    return (
      <motion.div
        className="relative min-h-[320px] rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500 to-blue-950 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-4000"></div>
        </div>
  
        <div className="relative p-6 flex flex-col h-full z-10 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {/* <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                <Code className="w-5 h-5 text-white" />
              </div> */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-950 text-transparent bg-clip-text">
                Code Collaboration Platform
              </h3>
            </div>
            <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
              <Avatar className="h-8 w-8 transition-transform duration-300 hover:scale-110">
                <AvatarImage src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="@username" />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
            </a>
          </div>
  
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Real-time collaborative coding platform with integrated code review, version control, and AI-powered
            suggestions.
          </p>
  
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
            >
              WebSockets
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
            >
              TypeScript
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
            >
              Monaco Editor
            </Badge>
          </div>
  
          <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4 mr-1 text-blue-600" />
            <span>Looking for: Full-stack Developer, UX Designer</span>
          </div>
  
          <div className="mt-4 pt-2">
            <div className="text-xs uppercase tracking-wider  mb-1 text-blue-600">Features</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                <span>Real-time collaboration</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                <span>Version control</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                <span>AI code suggestions</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                <span>Code review tools</span>
              </div>
            </div>
          </div>
  
          <div className="mt-auto pt-4 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 rounded-2xl text-blue-600 hover:bg-blue-600 hover:text-white hover:border-white hover:border-2 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
            
              Read more
            </Button>
           
          </div>
        </div>
      </motion.div>
    )
  }
  export default CollabCard;