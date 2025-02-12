import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import studentLoginImage from "../assets/student-login-page.jpg";
import teacherLoginImage from "../assets/teacher-login-page.jpg";

function Signup() {
  const { setIsAuthenticated } = useOutletContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [fileNames, setFileNames] = useState({ avatar: "Choose Avatar", coverImage: "Choose Cover Image" });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "avatar") {
        setAvatar(files[0]);
        setFileNames((prev) => ({ ...prev, avatar: files[0].name }));
      } else if (name === "coverImage") {
        setCoverImage(files[0]);
        setFileNames((prev) => ({ ...prev, coverImage: files[0].name }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (isTeacher) {
      formData.append("avatar", avatar);
      formData.append("coverImage", coverImage);
    }

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match");
      return;
    }

    try {
      const axiosInstance = axios.create({ timeout: 50000 });
      const response = await axiosInstance.post(
        isTeacher
          ? "http://127.0.0.1:8000/api/v1/educator/registerEducator"
          : "http://127.0.0.1:8000/api/v1/users/registerUser",
        formData,
        { headers: { "Content-Type": isTeacher ? "multipart/form-data" : "application/json" } }
      );

      console.log(formData);
      console.log(response.data);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      setIsAuthenticated(true);
      navigate("/");
      setError("");
    } catch (err) {
      setError("Error occurred while connecting to the server");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen mt-12 flex flex-col md:flex-row bg-white">
      {/* Form Section */}
      <div className="flex flex-1 flex-col items-center justify-center w-full md:w-1/2 p-6">
        <h2 className="text-2xl font-bold mb-6">{isTeacher ? "Educator Signup" : "Signup"}</h2>
        <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
          <input className="border border-gray-300 p-2 rounded-lg w-full" type="text" name="name" placeholder="Name" required />
          <input className="border border-gray-300 p-2 rounded-lg w-full" type="email" name="email" placeholder="E-mail address" required />
          <input className="border border-gray-300 p-2 rounded-lg w-full" type="password" name="password" placeholder="Password" required />
          <input className="border border-gray-300 p-2 rounded-lg w-full" type="password" name="confirmPassword" placeholder="Re-enter password" required />

          {isTeacher && (
            <>
              <label className="w-full flex flex-col">
                <span className="text-sm font-medium mb-1">Avatar</span>
                <label className="cursor-pointer border border-gray-300 p-2 rounded-lg text-gray-700 flex justify-between items-center">
                  {fileNames.avatar}
                  <input type="file" name="avatar" onChange={handleFileChange} className="hidden" />
                </label>
              </label>
            </>
          )}

          {error && <span className="text-red-500 text-sm">{error}</span>}
          <button className="bg-black text-white py-2 rounded-lg w-full hover:bg-gray-900 transition" type="submit">Sign Up</button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in here</Link></p>
          <p className="mt-2">
            {isTeacher ? "Student signup" : "Educator signup"}{" "}
            <button className="text-blue-600 hover:underline cursor-pointer" onClick={() => setIsTeacher(!isTeacher)}>here</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
