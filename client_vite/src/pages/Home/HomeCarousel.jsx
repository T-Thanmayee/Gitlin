import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
 

function HomeCarousel() {
  return (
    <div className='w-screen mt-3'>
         <Carousel className="" > 
      <CarouselContent >
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-full">
            <div className="p-1">
              <Card className="w-full h-[500px]">
                <CardContent className="flex flex-col items-center justify-end p-6 h-full" style={{backgroundImage: `url(https://wallpapers.com/images/hd/good-background-iegpv34e167xjt5i.jpg)`}}>
                  <span className="text-4xl font-semibold text-black text-center z-10 ">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-10 text-black"/>
      <CarouselNext className="right-10 text-black"/>
    </Carousel>
    </div>
  )
}

export default HomeCarousel