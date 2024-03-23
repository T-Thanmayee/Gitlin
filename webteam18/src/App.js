
import ImgMediaCard from './component/ImgMediaCard'; 
import RouteLayout from './component/RouteLayout';
import Home from './component/Home'
import Footer from './component/Footer';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Error1 from './component/Error1';
import Fileupload from './component/Fileupload';
import 'bootstrap/dist/css/bootstrap.min.css'
import RecipeReviewCard from './component/HomeCard';
import HomeList from './component/HomeList';


function App() {
  let router=createBrowserRouter([
    {
      path:'',
      element:<RouteLayout />,
      errorElement:<Error1 />,
      children:[
                 {
                   path:'',
                   element:<HomeList/>
                },
                {
                  path:'project',
                  element:<ImgMediaCard/>
                },
                {
                  path:'createProject',
                  element:<Fileupload/>
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
// import "./App.css"; 
// import { createBrowserRouter,RouterProvider } from "react-router-dom";
// import RouteLayout from "./component10/RouteLayout";
// import Home from './component10/Home/Home'
// import Register from "./component10/Register/Register";
// import Login from "./component10/Login/Login";
// import UserProfile from "./component10/user-profile/UserProfile";
// import AuthorProfile from "./component10/author-profile/AuthorProfile";
// import Error1 from "./component10/Error1"
// import Navigation from "./component10/Navgation/Navigation";
// import Articles from "./component10/articles/Articles";

// function App(){
//   let router=createBrowserRouter([
//     {
//       path:'',
//       element:<RouteLayout />,
//       errorElement:<Error1 />,
//       children:[
//         {
//           path:'',
//           element:<Home />
//         },
//         {
//           path:'Register',
//           element:<Register />
//         },
//         {
//           path:'Login',
//           element:<Login />
//         },
//         {
//           path:"/user-profile",
//           element:<UserProfile />,
//           children:[
//             {
//               path:"articles",
//               element:<Articles/>
//             }
//           ]
//         },
        
//         {
//           path:'/author-profile',
//           element:<AuthorProfile />,
          
//         }

//       ]
//     }
    
//   ])
//   return(
//     <div>
//       <RouterProvider router={router} />
//     </div>
//   )
// }
// export default App; 