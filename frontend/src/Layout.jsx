import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'




function Layout() {
  return (
    <div style={{fontFamily:'"DM Sans", serif'}}>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout
