import React from 'react';
import landingImage from '../assets/landing-image.jpg'; // Make sure to replace this with the correct path to your image

function Landing() {
  return (
    <div className='min-h-screen flex bg-white'>
      <div className='flex-1 flex flex-col justify-center items-start p-10'>
        <h1 className='text-4xl font-bold mb-4'>Welcome to Book My Course</h1>
        <p className='text-lg mb-4'>Your one-stop solution for booking and managing courses.</p>
        <p className='text-lg'>Join us today and start learning!</p>
      </div>
      <div className='flex-1 flex justify-center items-center'>
        <img src={landingImage} alt='Landing' className='max-w-full h-auto' draggable={false} />
      </div>
    </div>
  );
}

export default Landing;
