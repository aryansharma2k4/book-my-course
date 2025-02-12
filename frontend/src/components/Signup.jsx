import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import studentLoginImage from '../assets/student-login-page.jpg';
import teacherLoginImage from '../assets/teacher-login-page.jpg';

function Signup() {
  const { setIsAuthenticated } = useOutletContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());

    if (formObject.password !== formObject.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const axiosInstance = axios.create({
        timeout: 50000
      })
      const response = await axiosInstance  .post(isTeacher ? "TEACHER_SIGNUP_URL" : "http://127.0.0.1:8000/api/v1/users/registerUser", JSON.stringify(formObject),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      const accessToken = response.data.data.accessToken;
            localStorage.setItem("accessToken", accessToken)
            setIsAuthenticated(true);
            navigate('/');
            setError('');
    } catch (err) {
      setError("Error occurred while connecting to the server");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-white flex-row">
      <div className="flex-1 flex flex-col justify-center items-center max-w-128 align-middle">
        <span className="text-2xl mt-16 font-bold">{isTeacher ? "Educator Signup" : "Signup"}</span>
        <form className="my-8 flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <input className="border-black border-1 p-2 w-72" type="text" name="name" placeholder="Name" required />
          <input className="border-black border-1 p-2 w-72" type="email" name="email" placeholder="E-mail address" required />
          <input className="border-black border-1 p-2 w-72" type="password" name="password" placeholder="Password" required />
          <input className="border-black border-1 p-2 w-72" type="password" name="confirmPassword" placeholder="Re-enter password" required />
          {error && <span className="text-red-500">{error}</span>}
          <button className="bg-black text-white py-2 rounded-lg cursor-pointer" type="submit">Sign Up</button>
        </form>
        <span>
          Already have an account? Log in <Link to="/login"><u>here</u></Link>
        </span>
        <span className="mt-2">
          {isTeacher ? "Student signup" : "Educator signup"} {" "}
          <button className='cursor-pointer' onClick={() => setIsTeacher(!isTeacher)}><u>here</u></button>
        </span>
      </div>
      <div className="flex-1 flex justify-center">
        <img src={isTeacher ? teacherLoginImage : studentLoginImage} alt='Signup' className='max-w-full h-auto' draggable={false} />
      </div>
    </div>
  );
}

export default Signup;
