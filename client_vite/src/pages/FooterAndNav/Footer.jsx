import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa"
import {
  Home,
  FolderPlus,
  BookOpen,
  MessageCircle,
  Users,
  GraduationCap,
  FileText,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Footer() {
  const quickLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/project/search", icon: FolderPlus },
    { name: "Tutorials", href: "/tutorials", icon: BookOpen },
    { name: "Community", href: "/users/search", icon: Users },
  ]

  const resources = [
    { name: "Add Project", href: "/project/addproject", icon: FolderPlus },
    { name: "Create Post", href: "/post/createpost", icon: FileText },
    { name: "Find Mentors", href: "/mentors", icon: GraduationCap },
    { name: "Help & FAQs", href: "/faqs", icon: HelpCircle },
  ]

  const community = [
    { name: "Chat Room", href: "/chat", icon: MessageCircle },
    { name: "Find Users", href: "/users/search", icon: Users },
    { name: "Mentor Network", href: "/mentors", icon: GraduationCap },
    { name: "Success Stories", href: "#", icon: FileText },
  ]

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaGithub, href: "#", label: "GitHub" },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                MyLogo
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering developers and learners through collaborative projects, mentorship, and community-driven
              learning experiences.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-sm">contact@mylogo.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-3 text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                  >
                    <link.icon className="h-4 w-4 text-green-400 group-hover:text-green-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white relative">
              Resources
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-3 text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                  >
                    <link.icon className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white relative">
              Stay Connected
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></span>
            </h4>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">
                Subscribe to get updates on new features and community highlights.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-green-400"
                />
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium px-6">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <p className="text-gray-300 text-sm font-medium">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 rounded-full text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 MyLogo. All rights reserved. Built with ❤️ for the developer community.
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/faqs" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/faqs" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/faqs" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
