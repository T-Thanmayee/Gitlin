import React, { useState } from "react";

const SlideInPage = () => {
  const [hoveredPost, setHoveredPost] = useState(false);
  const [hoveredUpload, setHoveredUpload] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Left Half (Post Area) */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100 relative">
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none"
          onMouseEnter={() => setHoveredPost(true)}
          onMouseLeave={() => setHoveredPost(false)}
        >
          Post
        </button>
        {/* Post area sliding image */}
        <img
          src="https://via.placeholder.com/300"
          alt="Sliding Image"
          className={`absolute top-1/2 transform -translate-y-1/2 right-[-300px] transition-all duration-500 ease-in-out ${
            hoveredPost ? "right-0 z-10" : "z-0"
          }`}
        />
      </div>

      {/* Right Half (Upload Area) */}
      <div className="w-1/2 relative bg-gray-200 flex items-center justify-center">
        <button
          className="px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 focus:outline-none"
          onMouseEnter={() => setHoveredUpload(true)}
          onMouseLeave={() => setHoveredUpload(false)}
        >
          Upload
        </button>
        {/* Upload area sliding image */}
        <img
          src="https://media.istockphoto.com/id/1317323736/photo/a-view-up-into-the-trees-direction-sky.jpg?s=612x612&w=0&k=20&c=i4HYO7xhao7CkGy7Zc_8XSNX_iqG0vAwNsrH1ERmw2Q="
          alt="Sliding Image"
          className={`absolute top-1/2 transform -translate-y-1/2 left-[-300px] transition-all duration-500 ease-in-out ${
            hoveredUpload ? "left-0 z-10" : "z-0"
          }`}
        />
      </div>
    </div>
  );
};

export default SlideInPage;
