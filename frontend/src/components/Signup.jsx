import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const { setIsAuthenticated } = useOutletContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null
  });
  
  // File name display state
  const [avatarFileName, setAvatarFileName] = useState("Choose Avatar");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      
      setFormData(prev => ({ ...prev, avatar: file }));
      setAvatarFileName(file.name);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    
    if (isTeacher && formData.avatar) {
      submitData.append("avatar", formData.avatar);
    }

    try {
      const response = await fetch(
        isTeacher
          ? "http://127.0.0.1:8000/api/v1/educator/registerEducator"
          : "http://127.0.0.1:8000/api/v1/users/registerUser",
        {
          method: 'POST',
          body: isTeacher ? submitData : JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
          headers: isTeacher 
            ? undefined 
            : { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.data.accessToken);
      setIsAuthenticated(true);
      toast.success("Signup successful");
      navigate("/");
    } catch (err) {
      setError(err.message || "Error occurred while connecting to the server");
      toast.error("Signup failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-12 flex flex-col md:flex-row bg-white">
      <div className="flex flex-1 flex-col items-center justify-center w-full md:w-1/2 p-6">
        <h2 className="text-2xl font-bold mb-6">{isTeacher ? "Educator Signup" : "Signup"}</h2>
        <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
          <input 
            className="border border-gray-300 p-2 rounded-lg w-full" 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name" 
            required 
          />
          <input 
            className="border border-gray-300 p-2 rounded-lg w-full" 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-mail address" 
            required 
          />
          <input 
            className="border border-gray-300 p-2 rounded-lg w-full" 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password" 
            required 
          />
          <input 
            className="border border-gray-300 p-2 rounded-lg w-full" 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Re-enter password" 
            required 
          />

          {isTeacher && (
            <label className="w-full flex flex-col">
              <span className="text-sm font-medium mb-1">Avatar</span>
              <label className="cursor-pointer border border-gray-300 p-2 rounded-lg text-gray-700 flex justify-between items-center">
                {avatarFileName}
                <input 
                  type="file" 
                  name="avatar" 
                  onChange={handleFileChange} 
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </label>
          )}

          {error && <span className="text-red-500 text-sm">{error}</span>}
          <button 
            className="bg-black text-white py-2 rounded-lg w-full hover:bg-gray-900 transition" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in here</Link></p>
          <p className="mt-2">
            {isTeacher ? "Student signup" : "Educator signup"}{" "}
            <button 
              className="text-blue-600 hover:underline cursor-pointer" 
              onClick={() => setIsTeacher(!isTeacher)}
            >
              here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;