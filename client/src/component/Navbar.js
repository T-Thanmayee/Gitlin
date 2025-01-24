import { FaBars, FaTimes, FaHome } from 'react-icons/fa'; // Import icons
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar((prevState) => !prevState);
  };

  return (
    <nav className="h-16 bg-[#fef7e5] flex justify-between items-center px-5 relative z-10">
      <div className="flex items-center">
        <FaHome size={40} className="text-[#574c4c]" />
      </div>
      <div
        className="menu-icon md:hidden cursor-pointer z-20"
        onClick={handleShowNavbar}
      >
        {showNavbar ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>
      <div
        className={`absolute top-16 right-0 bg-[#fef7e5] transition-all duration-300 ease-in-out overflow-hidden z-10 md:static md:bg-transparent md:flex md:w-auto ${
          !showNavbar ? 'w-[270px] h-[calc(100vh-60px)]' : 'w-0 h-0'
        }`}
      >
        <ul className="flex flex-col md:flex-row md:items-center md:space-x-14 p-5 md:p-0">
          <li>
            <NavLink
              to="/"
              className="text-[#2f234f] text-sm font-normal transition-colors hover:text-[#574c4c]"
              activeClassName="text-[#574c4c] font-medium"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              className="text-[#2f234f] text-sm font-normal transition-colors hover:text-[#574c4c]"
              activeClassName="text-[#574c4c] font-medium"
            >
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className="text-[#2f234f] text-sm font-normal transition-colors hover:text-[#574c4c]"
              activeClassName="text-[#574c4c] font-medium"
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className="text-[#2f234f] text-sm font-normal transition-colors hover:text-[#574c4c]"
              activeClassName="text-[#574c4c] font-medium"
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className="text-[#2f234f] text-sm font-normal transition-colors hover:text-[#574c4c]"
              activeClassName="text-[#574c4c] font-medium"
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
