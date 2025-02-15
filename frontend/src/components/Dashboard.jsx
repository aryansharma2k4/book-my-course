import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserPhoto = ({ user }) => (
  <>
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
  </>
);

const CourseList = ({ courses, navigate }) => (
  <>
    {courses.length === 0 ? (
      <p>No courses available</p>
    ) : (
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="p-4 bg-gray-100 rounded shadow">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-gray-600">{course.description}</p>
            <button
              onClick={() => navigate(`/course/view/${course._id}`)}
              className="mt-2 px-4 py-2 bg-cyan-300 text-black rounded hover:bg-cyan-400 transition-colors duration-300"
            >
              View Course
            </button>
          </li>
        ))}
      </ul>
    )}
  </>
);

const LiveStreamList = ({ streams, navigate }) => (
  <>
    {streams.length === 0 ? (
      <p>No live streams available</p>
    ) : (
      <ul className="space-y-4">
        {streams.map((stream) => (
          <li key={stream.id} className="p-4 bg-gray-100 rounded shadow">
            <h3 className="text-lg font-semibold">{stream.title}</h3>
            <p className="text-gray-600">{stream.description}</p>
            <button
              onClick={() => navigate(`/viewLiveStream  /${stream._id}`)}
              className="mt-2 px-4 py-2 bg-cyan-300 text-black rounded hover:bg-cyan-400 transition-colors duration-300"
            >
              Go Live Now
            </button>
          </li>
        ))}
      </ul>
    )}
  </>
);

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast("Please login or create an account to continue");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/educator/getDetails",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const coursesArray = response.data.message.courses || [];
        const livestreamArray = response.data.message.livestreams || [];

        const coursePromises = coursesArray.map((courseId) =>
          axios.get(`http://127.0.0.1:8000/api/v1/course/${courseId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        );

        

        const streamPromises = livestreamArray.map((streamId) =>
          axios.get(`http://127.0.0.1:8000/api/v1/livestream/stream/${streamId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        );
        

        const courseResults = await Promise.all(coursePromises);
        const streamResults = await Promise.all(streamPromises);
        console.log(streamResults);
        
        

        setCourses(courseResults.map((res) => res.data.message));
        setLiveStreams(streamResults.map((res) => res.data.message));
        setUser(response.data.message);

        

        
        
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load profile");
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-2xl h-full mt-24 p-6 md:p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl md:text-5xl font-bold pt-4">Dashboard</h1>
        <hr className="border border-gray-300 w-full my-4" />
        {user ? (
          <div className="flex flex-col items-center gap-y-4">
            <UserPhoto user={user} />
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => navigate("/scheduleLiveStream")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Schedule Live Stream
              </button>
              <button
                onClick={() => navigate("/addCourse")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
              >
                Create Course
              </button>
            </div>
            <div className="w-full text-left mt-6">
              <h2 className="text-xl font-bold mb-2">Educator's Live Streams</h2>
              <LiveStreamList streams={liveStreams} navigate={navigate} />
              <h2 className="text-xl font-bold mt-6 mb-2">Educator's Courses</h2>
              <CourseList courses={courses} navigate={navigate} />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
