import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import RouteLayout from './pages/RouteLayout';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
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
import CreatePostui from './pages/Post/CreatePostui';
import Postui from './pages/Post/Postui';
import { MentorDisplayCard } from './pages/Mentor/MentorDisplayCards';
import DisplayUserWithSearch from './pages/ProfileUser/DisplayUserWithSearch';
import { DetailedProfile } from './pages/ProfileUser/DetailedProfile';
import ProfilePage from './pages/ProfileUser/ProfilePage';
import EditProfile from './pages/ProfileUser/EditProfile';
import AddProjectForm from './pages/Project Folder/AddProjectForm';
import ProjectSearchPage from './pages/Project Folder/ProjectSearchPage';
import RegisterMentor from './pages/ProfileUser/registermentor';
import {Card3} from './pages/Project Folder/Card3';
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
                },{
                  path:'project',
                  children:[
                    {
                      path:'addproject',
                      element:<AddProjectForm />
                    },
                    {
                      path:'search',
                      element:<ProjectSearchPage />
                    },
                    {
                      path:':id',
                      element:<Card3 />
                    }
                  ]
                },
                 {
                  path:'registermentor',
                  element:<RegisterMentor/>
                },
                
                
                {
                  path:'register',
                  element:<Register/>
                },
                {
                  path:'registermentor',
                  element:<RegisterMentor/>
                },
                {
                  path:'login',
                  element:<Login />
                },
                {
                  path:'post',
                  children:[ {
                  path:'createpost',
                  element:<CreatePostui />
                },
                {
                  path:'post',
                  element:<Postui />
                },]
                }
               ,

                {
                  path:'profile/:userId',
                  element:<ProfilePage />
                },
                {
                  path:'tutorials',
                  element:<Tutorials/>
                }   ,
                {
                  path:'edit/:userId',
                  element:<EditProfile/>
                },
                {
                  path:'faqs',
                  element:<FAQs/>
                },
                {
                  path:'users',
                  children:[
                    {
                      path:'search',
                     element:<DisplayUserWithSearch/>
                    },
                    {
                      path:':userId',
                      element:<ProfilePage/>
                    }
                    
                  ]
                },
                {
                  path:'search',
                  element:<SearchResults/>

                },
                {
                  path:'mentors',
                  element:<MentorDisplayCard/>
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


