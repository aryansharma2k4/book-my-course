import React from 'react'
import { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from"axios";


function Login() {
    const [error,setError]=useState('');
    const [isTeacher, setIsTeacher]=useState(false);
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

            setError('');
        }
        catch(err){
            setError("Server error");
            console.log(err);
        }

        
    }

    
  return (
    <div>
      <div className='min-h-screen flex bg-pink-100'>
      <div className='self-center mx-auto bg-white p-10 rounded-lg shadow-lg w-2/3 md:w-1/3'>
      <span className='text-2xl'>{!isTeacher ? (<>Log in </>):(<>Educator login </>)}</span>
      <form className='my-8 flex flex-col gap-y-5' onSubmit={handleSubmit}>
                        <input className='border-black border-1 py-2 px-3' type='email' name='email' placeholder='E-mail' required />
                        <input className='border-black border-1 py-2 px-3' type='password' name='password' placeholder='Password' required />
                        {error && <span className='text-red-500'>{error}</span>}
                        <button className='bg-black text-white py-2 rounded-lg' type='submit'>Log in</button>
                    </form>
                    <span>Don't have an account? Sign up <Link to='/signup'><u>here</u></Link></span><br/>
                    <span>{!isTeacher ? (<>Educator login </>):(<>Student Login </>)}{" "} <button onClick={()=>{setIsTeacher(!isTeacher)}}><u>here</u></button></span>
      </div>
      </div>
    </div>
  )
}

export default Login
