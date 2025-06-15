import { createBrowserRouter } from 'react-router-dom';
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Post from "@/pages/Post";
import Profile from "@/pages/Profile";
import MyLikes from "@/pages/MyLikes";

// ROUTING FOR WHEN THE API IS WORKING - APP OPENS ON THE LOGINREGISTER PAGE
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <MainLayout />,
//     children: [
//       { path: '', element: <LoginRegister /> },
//       { path: 'home', element: <Home /> },
//       { path: 'post/:id', element: <Post /> },
//       { path: 'profile/:id', element: <Profile /> },
//       { path: "/my-likes", element: <MyLikes /> },
//     ],
//   },
// ]);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <Login /> },
      { path: '/login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'home', element: <Home /> },
      { path: 'post/:id', element: <Post /> },
      { path: 'profile/:id', element: <Profile /> },
      { path: "/my-likes", element: <MyLikes /> },
    ],
  },
]);

export default router;
