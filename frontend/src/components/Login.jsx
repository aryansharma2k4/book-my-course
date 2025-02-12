import React from 'react'
import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import axios from "axios";
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
                url: isTeacher ? "TEACHER_LOGIN_URL" : "http://127.0.0.1:8000/api/v1/users/loginUser",
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
            navigate('/');
            setError('');
        }
        catch(err){
            setError("Server error");
            console.log(err);
        }
    }

  return (
    <div className='min-h-screen flex bg-white flex-row'>
      <div className='flex-1 flex flex-col justify-center items-center max-w-128'>
        <span className='text-2xl font-bold'>{!isTeacher ? (<>Log in </>):(<>Educator login </>)}</span>
        <form className='my-8 flex flex-col gap-y-5' onSubmit={handleSubmit}>
          <input className='border-black border-1 p-2 w-72' type='email' name='email' placeholder='E-mail' required />
          <input className='border-black border-1 p-2 w-72' type='password' name='password' placeholder='Password' required />
          
          <button className='bg-black text-white py-2 rounded-lg cursor-pointer mt-2' type='submit'>Log in</button>
          
        </form>
        <span>Don't have an account? Sign up <Link to='/signup'><u>here</u></Link></span>
        <span className='mt-2'>{!isTeacher ? (<>Educator login </>):(<>Student Login </>)}{" "} <button className='cursor-pointer' onClick={()=>{setIsTeacher(!isTeacher)}}><u>here</u></button></span>
          {error && <span className='text-red-500'>{error}</span>}
      </div>
      <div className='flex-1 flex justify-center'>
        <img src={isTeacher ? teacherLoginImage : studentLoginImage} alt='Login' className='max-w-full h-auto transition' draggable={false} />
      </div>
    </div>
  )
}

export default Login
