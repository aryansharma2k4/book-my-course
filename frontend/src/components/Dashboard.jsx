import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userLiveStreams, setUserLiveStreams] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [userCourses,setUserCourses]=useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast("Please login or create an account to continue");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Attempt to fetch educator details and live streams.
        const educatorResponse = await axios.get(
          "http://127.0.0.1:8000/api/v1/educator/getDetails/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const lsResponse = await axios.get(
          "http://127.0.0.1:8000/api/v1/educator/getls",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log(educatorResponse);
        console.log(educatorResponse.data.message.courses)
        setUserCourses(educatorResponse.data.message.courses)
        setUser(educatorResponse.data.message);
        setUserLiveStreams(lsResponse.data.message);
        setIsEducator(true);
        console.log(lsResponse.data.message)
      } catch (error) {
        console.warn("Educator endpoint failed, trying user endpoint...", error);
        try {
          // Fallback to fetching regular user details.
          const userResponse = await axios.get(
            "http://127.0.0.1:8000/api/v1/users/getDetails/",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          setUser(userResponse.data.message);
          setIsEducator(false);
        } catch (error) {
          console.error("Error fetching user details from both endpoints:", error);
          toast.error("Failed to load profile");
        }
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
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            {/* Only show live streams if the user is an educator and there are live streams */}
            {userLiveStreams.length == 0 && (<>You do not have any live streams active</>)}
            {isEducator && userLiveStreams.length > 0 && (
              <>
                <p className="text-gray-600 self-start">Your live streams</p>
                <hr className="w-full border border-gray-300" />
                <ul className="space-y-4">
                  {userLiveStreams.map((ls) => (
                    <li key={ls} className="flex items-center justify-between w-full">
                      <p className="text-gray-600">{ls.title}</p>
                      <button
                        onClick={() => navigate(`/viewLiveStream/${ls}`)}
                        className="px-4 py-2 bg-cyan-300 text-black rounded hover:bg-cyan-400 transition-colors duration-300"
                      >
                        Watch
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {userCourses.length == 0 && (<>You do not have any courses active</>)}
            {isEducator && userCourses.length > 0 && (
              <>
                <p className="text-gray-600 self-start">Your courses</p>
                <hr className="w-full border border-gray-300" />
                <ul className="space-y-4">
                  {userCourses.map((cs) => (
                    <li key={cs} className="flex items-center justify-between w-full">
                      <p className="text-gray-600">{cs.title}</p>
                      <button
                        onClick={() => navigate(`/course/view/${cs}`)}
                        className="px-4 py-2 bg-cyan-300 text-black rounded hover:bg-cyan-400 transition-colors duration-300"
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
