import React, { useState, useEffect } from "react";
import img from "../../assets/search.png";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth >= 768);

  const history = ["React", "Node.js", "Tailwind", "Redux"]; // Dummy search history

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
        setShowSearch(true); // Ensure input is visible when resizing to large screens
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
    <nav className="bg-gray-800 text-white flex items-center justify-between px-6 py-4 z-10 sticky top-0">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold">MyLogo</div>

        {/* Search Container */}
        <div className="relative flex items-center search-container">
          {/* Search Icon - Always visible */}
          <button className="w-6 h-6 border-none bg-white p-0 md:w-8 md:h-8" onClick={toggleSearch}>
            <img src={img} alt="Search Icon" className="bg-white p-1" />
          </button>

          {/* Show input only if on large screens OR if search is toggled on */}
          {(isMediumScreen || showSearch) && (
            <div className="relative z-10">
              <input
                className="text-black border border-gray-300 rounded px-2 ml-2"
                type="text"
                placeholder="Search..."
                onClick={handleInputClick} // Show history when clicking inside
              />

              {/* Search History List */}
              {history.length > 0 && showHistory && (
                <ul className="absolute left-1.5 top-10 w-full bg-white border border-gray-300 rounded shadow-lg">
                  {history.map((item, index) => (
                    <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer text-black">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
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
      <ul className={`fixed top-14 right-0 bg-gray-800 w-full flex flex-col items-center transition-transform duration-300 md:static md:flex-row md:w-auto md:space-x-6 md:transform-none ${isNavOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        <li className="py-2 md:py-0 hover:underline">
          <a href="#">Home</a>
        </li>
        <li className="py-2 md:py-0 hover:underline">
          <a href="#">About</a>
        </li>
        <li className="py-2 md:py-0 hover:underline">
          <a href="#">FAQs</a>
        </li>
        <li className="py-2 md:py-0 hover:underline">
          <a href="#">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
