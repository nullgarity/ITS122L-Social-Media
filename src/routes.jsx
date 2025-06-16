import { createBrowserRouter } from 'react-router-dom';
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Post from "@/pages/Post";
import Profile from "@/pages/Profile";
import MyLikes from "@/pages/MyLikes";
import { ThemeProvider } from './contexts/ThemeContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
    ),
    children: [
      { path: '', element: <Login /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'home', element: <Home /> },
      { path: 'post/:id', element: <Post /> },
      { path: 'profile', element: <Profile /> },
      { path: "my-likes", element: <MyLikes /> },
    ],
  },
]);

export default router;