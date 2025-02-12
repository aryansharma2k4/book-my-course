import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import companyLogo from '../assets/company-logo.svg';
import toast from "react-hot-toast";

function Header({isAuthenticated, setIsAuthenticated}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <div>
      <header className="h-24 bg-[#040F0F] fixed top-0 left-0 min-w-screen text-xl text-white flex justify-between items-center px-10 mb-4">
        <Link to="/">
          <img className='h-10 sm:h-12' src={companyLogo} alt="Company Logo"/>
        </Link>
        <ul className="flex gap-x-5 align-middle">
          {isAuthenticated ? (
            <>
              <button className="text-red-400 cursor-pointer" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup"> Sign up </Link>
              </li>
            </>
          )}
        </ul>
      </header>
    </div>
  );
}

export default Header;
