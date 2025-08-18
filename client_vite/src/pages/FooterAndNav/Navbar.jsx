"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link, useLocation } from "react-router-dom"
import {
  Search,
  X,
  ChevronDown,
  User,
  LogOut,
  UserCircle,
  Home,
  MessageCircle,
  GraduationCap,
  FileText,
  HelpCircle,
  PlusCircle,
  SearchIcon,
  UserSearch,
  MessageSquare,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ModeToggle } from "@/components/mode-toggle"
import { logoutUser } from "../../Redux/Slices/authSlice"

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isMediumScreen, setIsMediumScreen] = useState(false)
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loginStatus, currentUser, errorOccured, errorMessage, isPending } = useSelector((state) => state.auth)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMediumScreen(window.innerWidth >= 768)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Handle clicks outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchExpanded && searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isSearchExpanded])

  // Focus input when search expands
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchExpanded])

  const toggleNav = () => setIsNavOpen(!isNavOpen)
  const toggleSearch = () => setIsSearchExpanded(!isSearchExpanded)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      navigate("/login")
    } catch (error) {
      console.error("Logout Error:", error)
    }
  }

  // Navigation items with icons and dropdowns
  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: location.pathname === "/",
      iconOnly: true,
    },
    {
      name: "Projects",
      isDropdown: true,
      items: [
        { name: "Add Project", href: "/project/addproject", icon: PlusCircle },
        { name: "Search Projects", href: "/project/search", icon: SearchIcon },
      ],
    },
    {
      name: "Posts",
      isDropdown: true,
      items: [
        { name: "Create Post", href: "/post/createpost", icon: PlusCircle },
        { name: "View Posts", href: "/post/post", icon: FileText },
      ],
    },
    {
      name: "Community",
      isDropdown: true,
      items: [
        { name: "Find Users", href: "/users/search", icon: UserSearch },
        { name: "Mentors", href: "/mentors", icon: GraduationCap },
        { name: "Chat", href: "/chat", icon: MessageCircle },
      ],
    },
    {
      name: "Help",
      href: "/faqs",
      icon: HelpCircle,
      isActive: location.pathname === "/faqs",
    },
  ]

  const NavLink = ({ item, isMobile = false }) => {
    const baseClasses = `
    flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-300 
    relative group cursor-pointer
    ${isMobile ? "w-full justify-start" : ""}
    ${item.isActive ? "bg-white/20 text-white" : "text-white/90 hover:text-white hover:bg-white/10"}
  `

    if (item.isDropdown) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={baseClasses}>
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.name}
              <ChevronDown className="h-3 w-3 ml-1" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 mt-2">
            <DropdownMenuLabel className="flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.items.map((subItem) => (
              <DropdownMenuItem key={subItem.name} asChild>
                <Link to={subItem.href} className="flex items-center gap-2 cursor-pointer">
                  <subItem.icon className="h-4 w-4" />
                  {subItem.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Link to={item.href} className={baseClasses} title={item.iconOnly ? item.name : undefined}>
        {item.icon && <item.icon className="h-4 w-4" />}
        {!item.iconOnly && item.name}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
      </Link>
    )
  }

  return (
    <>
      {/* Search overlay */}
      {isSearchExpanded && !isMediumScreen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={() => setIsSearchExpanded(false)}>
          <div
            ref={searchContainerRef}
            className="absolute top-0 left-0 w-full bg-white dark:bg-gray-900 p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSearchExpanded(false)} className="text-gray-500 dark:text-gray-400">
                <X className="h-5 w-5" />
              </button>
              <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search projects, posts, users..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="text-2xl font-bold bg-white text-green-600 rounded-lg p-2 group-hover:scale-105 transition-transform">
                  ML
                </div>
                <span className="text-xl font-semibold hidden sm:block">MyLogo</span>
              </Link>

              {/* Desktop Search */}
              {isMediumScreen && (
                <div className="hidden md:flex items-center">
                  <div className="relative">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 min-w-[300px]">
                      <Search className="h-4 w-4 text-white/70 mr-3" />
                      <input
                        type="text"
                        placeholder="Search everything..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/70"
                      />
                      <button className="bg-white text-green-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-0">
              {navigationItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              {/* Mobile Search */}
              {!isMediumScreen && (
                <button
                  className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                  onClick={toggleSearch}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* Mode Toggle */}
              <ModeToggle />

              {/* Auth Section */}
              {loginStatus ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 text-white hover:bg-white/10 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {currentUser?.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                      </div>
                      <span className="hidden sm:block text-sm font-medium max-w-20 truncate">
                        {currentUser?.name || "User"}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2" align="end">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={`/profile/${currentUser?._id}`} className="flex items-center gap-2 cursor-pointer">
                        <UserCircle className="h-4 w-4" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/edit/${currentUser?._id}`} className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        Edit Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/mentorchat" className="flex items-center gap-2 cursor-pointer">
                        <MessageSquare className="h-4 w-4" />
                        Mentor Chat
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                      onClick={handleLogout}
                      disabled={isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {isPending ? "Logging out..." : "Logout"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-1">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 bg-white text-green-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    Register
                  </Link>
                
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex flex-col justify-between h-6 w-8 cursor-pointer"
                onClick={toggleNav}
                aria-label="Toggle menu"
              >
                <span
                  className={`h-0.5 bg-white rounded transition-transform duration-300 ${
                    isNavOpen ? "transform rotate-45 translate-y-2.5" : ""
                  }`}
                ></span>
                <span
                  className={`h-0.5 bg-white rounded transition-opacity duration-300 ${isNavOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`h-0.5 bg-white rounded transition-transform duration-300 ${
                    isNavOpen ? "transform -rotate-45 -translate-y-2.5" : ""
                  }`}
                ></span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              isNavOpen ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <div className="space-y-2 pt-4 border-t border-white/20">
              {navigationItems.map((item) => (
                <NavLink key={item.name} item={item} isMobile />
              ))}

              {!loginStatus && (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-3 py-2 bg-white text-green-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    <UserCircle className="h-4 w-4" />
                    Register
                  </Link>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Error Alert */}
      {errorOccured && (
        <Alert variant="destructive" className="fixed top-20 right-4 max-w-sm z-50">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default Navbar
