 import React, { useState, useEffect } from "react";
import img from "../../assets/search.png";
import { ModeToggle } from "../../components/mode-toggle";
import { TableRowsSplit } from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth >= 768);

  // const history = ["React", "Node.js", "Tailwind", "Redux"]; // Dummy search history

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleSearch = () => {
    if (!isMediumScreen) {
      setShowSearch(!showSearch);
    }
  };

  const handleInputClick = () => {
    setShowHistory(true);
  };

  // Detect screen size changes and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth >= 768);
      if (window.innerWidth >= 768) {
        setShowSearch(true);
         // Ensure input is visible when resizing to large screens
      } else {
        setShowSearch(false); // Hide search input when moving to small screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Hide search input and history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowSearch(false);
        setShowHistory(false); // Always close history when clicking outside
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-indigo-50 dark:bg-gray-800 text-white flex items-center justify-between px-6 py-4 z-10 sticky top-0">
      {/* Logo */}
      <div className="flex items-center space-x-10">
        <div className="text-xl font-bold">MyLogo</div>

       
      
<div className="flex items-center justify-center">
  <div className="rounded-lg">
    <div className="flex">
      <div className="rounded-s-full border-1 hello border-black  dark:bg-gray-600 flex w-10 items-center justify-center   p-5">
        <svg viewBox="0 0 20 20" aria-hidden="true" className=" pointer-events-none absolute w-5 dark:fill-white transition">
          <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
        </svg>
      </div>
      <input type="text" className=" w-full max-w-[160px] dark:bg-gray-600 pl-2 text-base font-semibold outline-0" placeholder="" id=""/>
      <input type="button" value="Search" className="bg-blue-500 p-2 rounded-e-full  text-white font-semibold hover:bg-blue-800 transition-colors"
      />
    </div>
  </div>
</div>
      </div>

      {/* Hamburger Toggle Button */}
      <div
        className="flex flex-col justify-between h-6 w-8 cursor-pointer md:hidden"
        onClick={toggleNav}
      >
        <span className={`h-1 bg-white rounded transition-transform duration-300 ${isNavOpen ? "transform rotate-45 translate-y-2" : ""}`}></span>
        <span className={`h-1 bg-white rounded transition-opacity duration-300 ${isNavOpen ? "opacity-0" : ""}`}></span>
        <span className={`h-1 bg-white rounded transition-transform duration-300 ${isNavOpen ? "transform -rotate-45 -translate-y-3" : ""}`}></span>
      </div>

      {/* Navigation Links */}
      <ul className={`fixed top-14 right-0  w-full flex flex-col items-center transition-transform duration-300 md:static md:flex-row md:w-auto md:space-x-6 md:transform-none ${isNavOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        <li className="p-1 md:py-0 ">
          <a className="relative after:bg-white after:absolute after:h-0.5 after:w-0 after:top-6 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer" href="#">Home</a>
        </li>
        <li className="py-2 md:py-0 ">
          <a className="relative after:bg-white after:absolute after:h-0.5 after:w-0 after:top-6 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer" href="#">About</a>
        </li>
        <li className="py-2 md:py-0">
          <a className="relative after:bg-white after:absolute after:h-0.5 after:w-0 after:top-6 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer" href="#">FAQs</a>
        </li>
        <li className="py-2 md:py-0 f">
          <a className="relative after:bg-white after:absolute after:h-0.5 after:w-0 after:top-6 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer" href="#">Contact</a>
        </li>
      <ModeToggle className=""/>      
      </ul>
    </nav>
  );
};

export default Navbar;
