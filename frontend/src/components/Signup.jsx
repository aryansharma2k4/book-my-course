import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Signup() {
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
      const response = await axios.post(isTeacher ? "TEACHER_SIGNUP_URL" : "STUDENT_SIGNUP_URL", JSON.stringify(formObject),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      setError("");
    } catch (err) {
      setError("Error occurred while connecting to the server");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-pink-100">
      <div className="self-center mx-auto bg-white p-10 rounded-lg shadow-lg w-2/3 md:w-1/3">
        <span className="text-2xl">{isTeacher ? "Educator Signup" : "Student Signup"}</span>
        <form className="my-8 flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <input className="border-black border-1 py-2 px-3" type="text" name="firstname" placeholder="First name" required />
          <input className="border-black border-1 py-2 px-3" type="text" name="lastname" placeholder="Last name" required />
          <input className="border-black border-1 py-2 px-3" type="email" name="email" placeholder="E-mail address" required />
          <input className="border-black border-1 py-2 px-3" type="password" name="password" placeholder="Password" required />
          <input className="border-black border-1 py-2 px-3" type="password" name="confirmPassword" placeholder="Re-enter password" required />
          {error && <span className="text-red-500">{error}</span>}
          <button className="bg-black text-white py-2 rounded-lg" type="submit">Sign Up</button>
        </form>
        <span>
          Already have an account? Log in <Link to="/login"><u>here</u></Link>
        </span>
        <br />
        <span className="mt-8">
          {isTeacher ? "Student signup" : "Educator signup"} {" "}
          <button onClick={() => setIsTeacher(!isTeacher)}><u>here</u></button>
        </span>
      </div>
    </div>
  );
}

export default Signup;
