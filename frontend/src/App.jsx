import { useState } from 'react'
import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Signup from './components/Signup'
import Login from './components/Login'
import Landing from './components/Landing'
import Video from './components/Video'
import './index.css';
import AddToCourse from './components/AddToCourse'
import CreateNewCourse from './components/CreateNewCourse'
import Dashboard from './components/Dashboard'
import CourseView from './components/CourseView'

const router = createBrowserRouter([{
  path: '/',
  element: <Layout />,
  children: [{
    index:true,
    element: <Landing/>
  },
    {
    path: 'signup',
    element: <Signup />,
  }, {
    path: 'login',
    element: <Login />,
  },{
    path:'video/:videoid',
    element: <Video/>
  },
{
  path:'addcourse/:courseid',
  element: <CreateNewCourse/>
},{
  path: 'course/edit/:courseid',
  element: <AddToCourse/>
},
{
  path:'course/view/:courseid',
  element: <CourseView/>
},
{
  path:'profile/:profileid',
  element: <Dashboard/>
}]
}])



function App() {
  

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
