import React, { useState } from "react";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="bg-gray-800 text-white flex items-center justify-between px-6 py-4 z-10 sticky top-0">
      {/* Logo */}
      <div className="text-xl font-bold">MyLogo</div>

      {/* Hamburger Toggle Button */}
      <div
        className="flex flex-col justify-between h-6 w-8 cursor-pointer md:hidden"
        onClick={toggleNav}
      >
        <span
          className={`h-1 bg-white rounded transition-transform duration-300 ${
            isNavOpen ? "transform rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`h-1 bg-white rounded transition-opacity duration-300 ${
            isNavOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`h-1 bg-white rounded transition-transform duration-300 ${
            isNavOpen ? "transform -rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </div>

      {/* Navigation Links */}
      <ul
        className={`fixed top-16 right-0 bg-gray-800 w-full flex flex-col items-center transition-transform duration-300 md:static md:flex-row md:w-auto md:space-x-6 md:transform-none ${
          isNavOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
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