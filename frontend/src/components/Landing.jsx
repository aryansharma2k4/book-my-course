import React from 'react';
import landingImage from '../assets/landing-image.jpg'; // Replace with the correct image path
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-24 flex flex-col md:flex-row items-center mt-12 bg-white px-6 md:px-12">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-start text-center md:text-left space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Welcome to <span className="text-blue-600">Book My Course</span></h1>
        <p className="text-lg text-gray-700">Your one-stop solution for booking and managing courses.</p>
        <p className="text-lg text-gray-600">Join us today and start learning!</p>

        {/* Browse Courses Button */}
        <button 
          onClick={() => navigate('/courses')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg transition duration-300"
        >
          Browse Courses
        </button>
      </div>

      {/* Right Image */}
      <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
        <img 
          src={landingImage} 
          alt="Landing" 
          className="max-w-full md:max-w-lg h-auto rounded-lg shadow-lg" 
          draggable={false} 
        />
      </div>
    </div>
  );
}

export default Landing;
