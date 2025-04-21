import React from 'react';

const RotateComponent = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div
        data-aos="rotate-cw" // AOS rotate animation
        data-aos-duration="1500"
        className="w-32 h-32 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl"
      >
        Rotate Me
      </div>
    </div>
  );
};

export default RotateComponent;