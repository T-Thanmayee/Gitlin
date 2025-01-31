// src/Footer.js
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
function Footer() {
  return (
    <footer className="bg-gray-800 py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8 lg:mb-0">
            <h4 className="text-lg text-white font-semibold capitalize mb-8 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-pink-500">
              Women
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Dresses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Tops
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Bottoms
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Jackets
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8 lg:mb-0">
            <h4 className="text-lg text-white font-semibold capitalize mb-8 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-pink-500">
              Collections
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Work Wear
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Casual Wear
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Evening Wear
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Winter Wear
                </a>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-1/4 px-4">
            <h4 className="text-lg text-white font-semibold capitalize mb-8 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-pink-500">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center bg-gray-600 rounded-full text-white hover:bg-white hover:text-gray-800 transition-all"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center bg-gray-600 rounded-full text-white hover:bg-white hover:text-gray-800 transition-all"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center bg-gray-600 rounded-full text-white hover:bg-white hover:text-gray-800 transition-all"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center bg-gray-600 rounded-full text-white hover:bg-white hover:text-gray-800 transition-all"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 px-4">
          <h4 className="text-lg text-white font-semibold capitalize mb-8 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-pink-500">
              Subscribe
            </h4>
            <div className="flex w-full max-w-sm items-center space-x-2">
      <Input  type="email" placeholder="Email" className="h-fit rounded" />
      <Button className=" bg-gray-600 rounded-full   hover:bg-white hover:text-gray-800 transition-all h-fit" type="submit">Subscribe</Button>
    </div>
            
            </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
