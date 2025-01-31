import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const SlideInPage = () => {
  const [hoveredPost, setHoveredPost] = useState(false);

  return (
   <div className={`$hoveredPost ? 'grid-cols-2' : ''`}>
    <Card >
      <div className={`flex flex-col items-center justify-center w-full h-full p-4 bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105 $`}>
        <h1 className="text-2xl font-bold">Slide In Page</h1>
        <p className="text-sm">Hover over the card to see the slide in effect</p>
        <Button className=" p-2" onMouseEnter={()=>setHoveredPost(true)}>Post</Button>
      </div>
    </Card>
    {
      hoveredPost && window.innerWidth>1024 && (
        <Card className=" bg-white shadow-lg animate-ease-in animate-slide-in-right animate-duration-700 ms-4">  
          <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-100">
            <h1 className="text-2xl font-bold">Slide In Page</h1>
            <p className="text-sm">Hover over the card to see the slide in effect</p>
          </div>
        </Card>
      )
    }
   </div>
  );
};

export default SlideInPage;
