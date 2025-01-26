import ImgMediaCard from './components/ImgMediaCard'; 
import RouteLayout from './components/RouteLayout';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Fileupload from './components/Fileupload';
import HomeList from './components/HomeList';
import Register from './components/Register';
import Login from './components/Login';
import StudentProfile from './components/StudentProfile';
import Tutorials from './components/tutorials';

function App() {
  let router=createBrowserRouter([
    {
      path:'',
      element:<RouteLayout />,
      children:[
                 {
                   path:'',
                   element:<HomeList/>
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


