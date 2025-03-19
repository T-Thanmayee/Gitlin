import { useState, useEffect, useRef } from "react";

const profiles = [
  {
    id: 1,
    name: "Michael Deo",
    role: "UI/UX Designer",
    location: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107",
    image: "https://bootdey.com/img/Content/avatar/avatar7.png",
  },
  {
    id: 2,
    name: "Sophia Allen",
    role: "Frontend Developer",
    location: "500 Market St, San Francisco, CA",
    image: "https://bootdey.com/img/Content/avatar/avatar2.png",
  },
  {
    id: 3,
    name: "Daniel Lee",
    role: "Backend Engineer",
    location: "1200 Mission St, San Francisco, CA",
    image: "https://bootdey.com/img/Content/avatar/avatar3.png",
  },
  {
    id: 4,
    name: "Emma Watson",
    role: "Product Manager",
    location: "600 California St, San Francisco, CA",
    image: "https://bootdey.com/img/Content/avatar/avatar6.png",
  },
];

const SearchResults = () => {
  const [search, setSearch] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (search) {
      const results = profiles.filter((profile) =>
        profile.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProfiles(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="relative w-full max-w-lg" ref={searchRef}>
        <input
          type="text"
          placeholder="Search people..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {showResults && (
          <div className="absolute w-full bg-white shadow-md rounded-md mt-1 z-10">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-3 text-gray-500">No results found</p>
            )}
          </div>
        )}
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-20 h-20 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-bold">{profile.name}</h3>
                <p className="text-gray-500">{profile.role}</p>
                <p className="text-sm text-gray-400">{profile.location}</p>
                <div className="mt-3 flex space-x-3">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Follow
                  </button>
                  <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
