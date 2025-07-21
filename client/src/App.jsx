import HomePage from "./routes/homePage/homePage"
import ListPage from "./routes/listPage/ListPage";
import  {Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import Login from "./routes/login/login";
import SignUp from "./routes/signup/signup";
import Contact from "./routes/contact/contact";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";

import{
  createBrowserRouter,
  RouterProvider,
}from "react-router-dom";
import ProfilePage from "./routes/profilepage/profilepage";
import About from "./routes/about/about";
import NewPostPage from "./routes/newPostPage/newPostPage";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";



function App() {
const router=createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"/",
        element:<HomePage/>,
      },
      {
        path:"/list",
        element:<ListPage/>,
        loader:listPageLoader,
      },
      {
        path:"/:id",
        element:<SinglePage/>,
        loader:singlePageLoader,
      },
      
      {
        path:"/login",
        element:<Login/>,
      },
      {
        path:"/signup",
        element:<SignUp/>
      },
      {
        path:"/about",
        element:<About/>
      },
      {
        path:"/contact",
        element:<Contact/>
      }
    ]
  },
  {
    path:"/",
    element:<RequireAuth/>,
    children:[
      {
        path:"/profile",
        element:<ProfilePage/>,
        loader:profilePageLoader,
      },
      {
        path:"/profile/update",
        element:<ProfileUpdatePage/>,
      },
      {
        path:"/profile/create",
        element:<NewPostPage/>,
      },
     
    ],
  },
]);



  return (
  <RouterProvider router={router}/>
 )
}

export default App;
