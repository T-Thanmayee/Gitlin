import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, X, ChevronDown, User, LogOut, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Import Alert for errors
import { ModeToggle } from "@/components/mode-toggle";
import { logoutUser } from "../../Redux/Slices/authSlice"; // Import logoutUser thunk

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginStatus, currentUser, errorOccured, errorMessage, isPending } = useSelector((state) => state.auth);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMediumScreen(window.innerWidth >= 715);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle clicks outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchExpanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded]);

  // Focus input when search expands
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleSearch = () => setIsSearchExpanded(!isSearchExpanded);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Services dropdown items
  const servicesItems = [
    { name: "About", href: "/about" },
    { name: "FAQs", href: "/faqs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Google-like search overlay */}
      {isSearchExpanded && !isMediumScreen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setIsSearchExpanded(false)}
        >
          <div
            ref={searchContainerRef}
            className="absolute top-0 left-0 w-full bg-white dark:bg-gray-900 p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchExpanded(false)}
                className="text-gray-500 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-green-600 dark:bg-green-700 text-white flex items-center justify-between px-6 py-4 z-10 sticky top-0">
        {/* Logo */}
        <div className="flex items-center space-x-10">
          <div className="text-xl font-bold">MyLogo</div>
          {/* Search - visible on medium screens and up */}
          {isMediumScreen && (
            <div className="search-container flex items-center justify-center">
              <div className="rounded-lg">
                <div className="flex">
                  <div className="rounded-s-full border-1 border-black dark:bg-green-800 flex w-10 items-center justify-center p-5">
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="pointer-events-none absolute w-5 dark:fill-white transition"
                    >
                      <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full max-w-[160px] pl-2 text-base font-semibold outline-0 border dark:border-white bg-green-800 text-white placeholder:text-gray-400"
                    placeholder="search here.."
                  />
                  <input
                    type="button"
                    value="Search"
                    className="bg-blue-500 p-2 rounded-e-full text-white font-semibold hover:bg-blue-800 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <ul
          className={`fixed top-14 right-0 w-full flex flex-col items-center transition-transform duration-300 md:static md:flex-row md:w-auto md:space-x-6 md:transform-none ${
            isNavOpen ? "translate-x-0 bg-green-700 p-5" : "translate-x-full md:translate-x-0"
          }`}
        >
          <li className="p-1 md:py-0">
            <a
              className="relative after:bg-gray-100 after:absolute after:h-0.5 after:w-0 after:top-6 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
              href="#"
            >
              Home
            </a>
          </li>

          {/* Services Dropdown */}
          <li className="py-2 md:py-0 relative group">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 relative cursor-pointer">
                  Services
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-2">
                <DropdownMenuLabel>Quick Links</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {servicesItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <a href={item.href} className="cursor-pointer">
                      {item.name}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {/* Conditionally render Register and Login links */}
          {!loginStatus && (
            <>
              <li className="py-2 md:py-0">
                <a
                  className="relative after:bg-gray-100 after:absolute after:h-0.5 after:w-0 after:top-6 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
                  href="/register"
                >
                  Register
                </a>
              </li>
              <li className="py-2 md:py-0">
                <a
                  className="relative after:bg-gray-100 after:absolute after:h-0.5 after:w-0 after:top-6 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
                  href="/login"
                >
                  Login
                </a>
              </li>
            </>
          )}
        </ul>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Search icon - visible only on small screens */}
          {!isMediumScreen && (
            <button
              className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {/* Mode Toggle */}
          <ModeToggle />

          {/* Profile Icon with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-white hover:bg-green-700 dark:hover:bg-green-600 rounded-full transition-colors">
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mt-2" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/profile/${currentUser._id}`)}>
                <UserCircle className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 hover:text-red-700"
                onClick={handleLogout}
                disabled={isPending}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hamburger Toggle Button */}
          <button
            className="flex flex-col justify-between h-6 w-8 cursor-pointer md:hidden"
            onClick={toggleNav}
            aria-label="Toggle menu"
          >
            <span
              className={`h-1 bg-white rounded transition-transform duration-300 ${
                isNavOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`h-1 bg-white rounded transition-opacity duration-300 ${isNavOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`h-1 bg-white rounded transition-transform duration-300 ${
                isNavOpen ? "transform -rotate-45 -translate-y-3" : ""
              }`}
            ></span>
          </button>
        </div>
      </nav>

      {/* Display logout error */}
      {errorOccured && (
        <Alert variant="destructive" className="fixed top-4 right-4 max-w-sm">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default Navbar;