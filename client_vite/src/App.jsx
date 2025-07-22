import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import RouteLayout from './pages/RouteLayout';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import '../aos-custom.css';
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
import MentorChatPage from './pages/Mentor/MentorsDisplay';
import MentorMessages from './pages/Mentor/MentorMessages'; // Import MentorMessages
import DisplayUserWithSearch from './pages/ProfileUser/DisplayUserWithSearch';
import { DetailedProfile } from './pages/ProfileUser/DetailedProfile';
import ProfilePage from './pages/ProfileUser/ProfilePage';
import EditProfile from './pages/ProfileUser/EditProfile';
import AddProjectForm from './pages/Project_Folder/AddProjectForm';
import ProjectSearchPage from './pages/Project_Folder/ProjectSearchPage';
import RegisterMentor from './pages/ProfileUser/registermentor';
import { Card3 } from './pages/Project_Folder/Card3';
import LinkedInChatPage from './pages/ChatRoom/LinkedInChatPage';
import MentorPage from './pages/Mentor/MentorPage';
const userId="68513b0287655694a9350b08"
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  let router = createBrowserRouter([
    {
      path: '',
      element: <RouteLayout />,
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'project',
          children: [
            {
              path: 'addproject',
              element: <AddProjectForm />
            },
            {
              path: 'search',
              element: <ProjectSearchPage />
            },
            {
              path: ':id',
              element: <Card3 />
            }
          ]
        },
        {
          path: 'register',
          element: <Register />
        },
        {
          path: 'registermentor',
          element: <RegisterMentor />
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'post',
          children: [
            {
              path: 'createpost',
              element: <CreatePostui />
            },
            {
              path: 'post',
              element: <Postui />
            }
          ]
        },
        {
          path: 'chat',
          element: <LinkedInChatPage userId={userId} />
        },
        {
          path: 'profile/:userId',
          element: <ProfilePage />
        },
        {
          path: 'tutorials',
          element: <Tutorials />
        },
        {
          path: 'edit/:userId',
          element: <EditProfile />
        },
        {
          path: 'faqs',
          element: <FAQs />
        },
        {
          path: 'users',
          children: [
            {
              path: 'search',
              element: <DisplayUserWithSearch />
            },
            {
              path: ':userId',
              element: <ProfilePage />
            }
          ]
        },
        {
          path: 'search',
          element: <SearchResults />
        },
        {
          path: 'mentors',
          element: <MentorDisplayCard />
        },
        {
          path: 'mentorchat',
          element: <MentorChatPage />
        },
        {
          path: 'mentormessages',
          element: <MentorMessages /> // New route for MentorMessages
        },
        {
          path:'mentor/:mentorId',
          element: <MentorPage />
        }
      ]
    }
  ]);

  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;