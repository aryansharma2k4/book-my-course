import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userLiveStreams, setUserLiveStreams] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      toast("Please login or create an account to continue");
      return;
    }
    
    const fetchUserData = async () => {
      try {
        // const response = await axios.get("http://127.0.0.1:8000/api/v1/educator/getDetails/",{headers: { Authorization: `Bearer ${accessToken}` }}
        const response = await axios.get("http://127.0.0.1:8000/api/v1/educator/getDetails/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const lsresponse = await axios.get("http://127.0.0.1:8000/api/v1/educator/getls", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(response);
        setUser(response.data.message);
        console.log(lsresponse.data.message);
        setUserLiveStreams(lsresponse.data.message);
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
              src={user.avatar || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full border border-gray-300"
            />
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600 self-start">Your live streams</p>
            <hr className="w-full border border-gray-300" />
            <ul className="space-y-4">
              {userLiveStreams.map((ls) => (
                <li key={ls._id} className="flex items-center justify-between w-full">
                  <p className="text-gray-600">{ls.title}</p>
                  <button
                    onClick={() => navigate(`/ext/${ls}`)}
                    className="px-4 py-2 bg-cyan-300 text-black rounded hover:bg-cyan-400 transition-colors duration-300"
                  >
                    Watch
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
