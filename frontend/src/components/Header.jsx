import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import companyLogo from '../assets/company-logo.svg';

function Header({isAuthenticated, setIsAuthenticated}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div>
      <div className="h-24 bg-[#040F0F] fixed top-0 left-0 min-w-screen text-xl text-white flex justify-between items-center px-10">
        <Link to="/">
          <img src={companyLogo} alt="Company Logo"/>
        </Link>
        <ul className="flex gap-x-5 align-middle">
          {isAuthenticated ? (
            <>
              <button className="text-red-400" onClick={handleLogout}>Log out</button>
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
      </div>
    </div>
  );
}

export default Header;
