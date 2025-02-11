import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'



function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsAuthenticated(false);
    }else{
      setIsAuthenticated(true);
    }
  },[])
  return (
    <div style={{fontFamily:'"DM Sans", serif'}}>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
      <Outlet context={{ isAuthenticated, setIsAuthenticated }}/>
      <Footer/>
    </div>
  )
}

export default Layout
