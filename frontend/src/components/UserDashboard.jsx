import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Component to display user photo or placeholder letter
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

// Component to list the registered courses
const CourseList = ({ courses, navigate }) => (
  <>
    {courses.length === 0 ? (
      <p className="text-gray-300">No registered courses found.</p>
    ) : (
      <ul className="space-y-4">
        {courses.map((course) =>
          course ? (
            <li
              key={course._id}
              className="p-4 bg-gray-900 rounded shadow flex justify-between items-center"
            >
              <div>
                <h4 className="text-lg text-white font-bold">{course.title}</h4>
                <p className="text-gray-300">{course.description}</p>
              </div>
              <button
                onClick={() => navigate(`/course/view/${course._id}`)}
                className="px-4 py-2 bg-green-400 text-black rounded hover:bg-green-500 transition-colors duration-300"
              >
                View Course
              </button>
            </li>
          ) : null
        )}
      </ul>
    )}
  </>
);

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", courses: [] });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast("Please login or create an account to continue");
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/users/getDetails/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        // Assuming response.data.message contains user info
        if (response.data.message) {
          const { name, email, courses: userCourses } = response.data.message;
          setUser({ name, email, courses: userCourses });
          if (userCourses && userCourses.length > 0) {
            fetchCourseDetails(userCourses);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load user details");
      }
    };

    const fetchCourseDetails = async (courseIds) => {
      try {
        const courseDetailsPromises = courseIds.map((courseId) =>
          getCourseById(courseId)
        );
        const coursesData = await Promise.all(courseDetailsPromises);
        setCourses(coursesData.filter((course) => course !== null));
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    };

    // Function to fetch course details by ID
    const getCourseById = async (courseId) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/course/${courseId}/`
        );
        return response.data.message;
      } catch (error) {
        console.error(`Error fetching course with ID ${courseId}:`, error);
        return null;
      }
    };

    fetchUserDetails();
  }, [navigate]);

  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16 bg-black text-white">
      <div className="w-full max-w-2xl h-full mt-24 p-6 md:p-8 bg-[#09090b] rounded-lg shadow-lg text-center">
        <h1 className="text-4xl md:text-5xl font-bold pt-4">User Dashboard</h1>
        <hr className="border border-gray-300 w-full my-6" />
        {user && user.name ? (
          <div className="flex flex-col items-center gap-y-4">
            <UserPhoto user={user} />
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-300">{user.email}</p>
            <div className="w-full text-left mt-6">
              <h3 className="text-xl font-bold mb-4">Registered Courses</h3>
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

export default UserDashboard;
