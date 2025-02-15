import React from 'react'
import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import studentLoginImage from '../assets/student-login-page.jpg';
import teacherLoginImage from '../assets/teacher-login-page.jpg';

function Login() {
    const { setIsAuthenticated } = useOutletContext();
    const [error,setError]=useState('');
    const [isTeacher, setIsTeacher]=useState(false);
    const navigate=useNavigate();


    const handleSubmit=async (e)=>{
        e.preventDefault();
        const formData=new FormData(e.target);
        const formObject=Object.fromEntries(formData.entries());

        try{
            const axiosInstance = axios.create({
              timeout: 50000
            })
            const response = await axios({
                url: isTeacher ? "http://127.0.0.1:8000/api/v1/educator/logInEducator" : "http://127.0.0.1:8000/api/v1/users/loginUser",
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                data: JSON.stringify(formObject)
              });
            console.log(response.data.data)
            const accessToken = response.data.data.accessToken;
            localStorage.setItem("accessToken", accessToken)
            setIsAuthenticated(true);
            toast.success("Login successful");
            navigate('/');

            setError('');
        }
        catch(err){
            setError("Server error");
            toast.error("Login failed");
            console.log(err);
        }
    }

  return (
    <div className='min-h-screen flex bg-black flex-row pt-24 text-white'>
      <div className='flex-1 flex flex-col justify-center items-center w-full md:w-1/2 p-6 bg-[#09090b] shadow-lg'>
        <span className='text-2xl font-bold mb-4'>{!isTeacher ? (<>Log in </>):(<>Educator login </>)}</span>
        <form className='w-full max-w-sm flex flex-col gap-4 my-4' onSubmit={handleSubmit}>
          <input className='border border-gray-200 rounded-lg text-gray-300 p-2 w-full' type='email' name='email' placeholder='E-mail' required />
          <input className='border border-gray-200 rounded-lg text-gray-300 p-2 w-full' type='password' name='password' placeholder='Password' required />
          
          <button className='bg-green-400 hover:bg-green-500 text-black py-2 rounded-lg cursor-pointer mt-2' type='submit'>Log in</button>
          
        </form>
        <span className='text-sm'>Don't have an account? Sign up <Link className='text-green-600 hover:underline' to='/signup'>here</Link></span>
        <span className='text-sm mt-2'>{!isTeacher ? (<>Educator login </>):(<>Student Login </>)}{" "} <button className='cursor-pointer text-green-600 hover:underline' onClick={()=>{setIsTeacher(!isTeacher)}}>here</button></span>
          {error && <span className='text-red-500'>{error}</span>}
      </div>
    </div>
  )
}

export default Login
