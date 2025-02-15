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
import LiveStream from './components/liveStream'
import ScheduleLiveStream from './components/ScheduleLiveStream'
import LiveStreamDetails from './components/LiveStreamDetails'
import StreamView from './components/StreamView'
import StreamAuxillary from './components/StreamAuxillary'
import LiveStreamView from './components/liveStreamView'
import BrowseLivestreams from './components/BrowseLivestreams'
import BrowseCourse from './components/BrowseCourse'
import UserDashboard from './components/UserDashboard'


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
  },{
    path: "livestream",
    element: <LiveStream />
  }, {
    path: 'login',
    element: <Login />,
  },{
    path:'video/:videoid',
    element: <Video/>
  },
{
  path:'addcourse',
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
  path:'profile/',
  element: <Dashboard/>
},{
  path:'schedulelivestream/',
  element: <ScheduleLiveStream/>
},{
  path:'viewLiveStream/:streamid',
  element: <StreamView/>
},{
  path:'ext/:streamid',
  element: <StreamAuxillary/>
},{
  path: 'viewStream/:streamId',
  element: <LiveStreamView />
},{
  path:'showlivestreams',
  element: <BrowseLivestreams/>
},{
  path:'showcourses',
  element:<BrowseCourse/>
},{
  path: 'myProfile',
  element: <UserDashboard/>
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
