import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      toast("Please login or create an account to continue");
      return;
    }
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile");
      }
    };
    
    fetchUserData();
  }, [navigate]);

  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-2xl h-full mt-24 p-6 md:p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl md:text-5xl font-bold pt-4">Dashboard</h1>
        <hr className="border border-gray-300 w-full my-4" />
        {user ? (
          <div className="flex flex-col items-center gap-y-4">
            <img
              src={user.profilePhoto || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full border border-gray-300"
            />
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
