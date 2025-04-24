import ImgMediaCard from './pages/ImgMediaCard'; 
import RouteLayout from './pages/RouteLayout';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Fileupload from './pages/Fileupload';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import '../aos-custom.css'; // Import your custom AOS CSS file here
import { useEffect } from 'react';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import StudentProfile from './pages/ProfileUser/StudentProfile';
import Tutorials from './pages/Tutorials/tutorials';
import HomeList from './pages/Home/HomeList';
import Home from './pages/Home/Home';
import FAQs from './pages/FooterAndNav/FAQs';
import SearchResults from './pages/Home/SearchResults';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      easing: 'ease-in-out', // Easing function
      once: true, // Trigger animation only once
      mirror: false, // Don't animate out when scrolling past
    });
  }, []);
  let router=createBrowserRouter([
    {
      path:'',
      element:<RouteLayout />,
      children:[
                 {
                   path:'',
                   element:<Home/>
                },
                {
                  path:'/project',
                  element:<ImgMediaCard/>
                },
                {
                  path:'Fileupload',
                  element:<Fileupload/>
                },
                {
                  path:'register',
                  element:<Register/>
                },
                {
                  path:'login',
                  element:<Login />
                },
                {
                  path:'profile',
                  element:<StudentProfile />
                },
                {
                  path:'tutorials',
                  element:<Tutorials/>
                }   ,
                {
                  path:'faqs',
                  element:<FAQs/>
                },
                {
                  path:'search',
                  element:<SearchResults/>

                }
              ]
    }
  ])
  return (
    <div>
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

            <Toaster/>
      <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;


