import { StrictMode } from 'react'
import { createRoot, ReactDom } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import App from './App.jsx'
import store from './app/store.js'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

import Profile from './pages/Profile.jsx'
import PostForm from './Components/PostForm/PostForm.jsx'
import { Home } from './pages/Home.jsx'
import TweetCard from './Components/TweetCard/TweetCard.jsx'

const router = createBrowserRouter([
  {
    path: '/', //!root
    element: <App/>,
    children: [
      {
         path: '/', //!root
         element: <Home/>,
      },
      {
        //!authLayout section 
      },
      {
        path: '/login',
        element: (
          <ProtectedRoute authentication = {false}>
            <Login/>
          </ProtectedRoute>
        )
      },
      {
        path: '/Signup',
        element: (
          <ProtectedRoute authentication ={false}>
            <Signup/>
          </ProtectedRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute authentication ={true}>
            <Profile/>
          </ProtectedRoute>
        )
      },
      {
        path: '/tweet',
        element: (
          <ProtectedRoute authentication ={true}>
            <PostForm/>
          </ProtectedRoute>
        )
      },
      {
        path : '/tweetCard',
        element: (
          <ProtectedRoute authentication ={true}>
            <TweetCard/>
          </ProtectedRoute>
        )
      }


    ]

  }
],
{
  basename: "/Twitter_Clone",
}
)



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router ={router}/>
    </Provider>
  </StrictMode>
)
