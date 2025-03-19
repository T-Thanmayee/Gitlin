import ImgMediaCard from './pages/ImgMediaCard'; 
import RouteLayout from './pages/RouteLayout';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Fileupload from './pages/Fileupload';

import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import StudentProfile from './pages/ProfileUser/StudentProfile';
import Tutorials from './pages/Tutorials/tutorials';
import HomeList from './pages/Home/HomeList';
import Home from './pages/Home/Home';
import FAQs from './pages/FooterAndNav/FAQs';
import SearchResults from './pages/Home/SearchResults';
function App() {
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
      
      <RouterProvider router={router} />
    </div>
  );
}

export default App;


