import React from 'react'
import { useState } from 'react';
import {Link} from 'react-router-dom';


function Login() {
    const [error,setError]=useState('');
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const formData=new FormData(e.target);
        const formObject=Object.fromEntries(formData.entries());
    }

    
  return (
    <div>
      <div className='min-h-screen flex bg-pink-100'>
      <div className='self-center mx-auto bg-white p-10 rounded-lg shadow-lg w-2/3 md:w-1/3'>
      <span className='text-2xl'>Log in</span>
      <form className='my-8 flex flex-col gap-y-5' onSubmit={handleSubmit}>
                        <input className='border-black border-1 py-2 px-3' type='email' name='email' placeholder='Enter your email' required />
                        <input className='border-black border-1 py-2 px-3' type='password' name='password' placeholder='Enter your password' required />
                        {error && <span className='text-red-500'>{error}</span>}
                        <button className='bg-black text-white py-2 rounded-lg' type='submit'>Log in</button>
                    </form>
                    <span>Don't have an account? Sign up <Link to='/signup'><u>here</u></Link></span>
      </div>
      </div>
    </div>
  )
}

export default Login
