import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard() {
  const [user, setUser] = useState({ name: "", email: "", courses: [] });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/users/getDetails/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log(response.data.message);

        if (response.data.message) {
          const { name, email, courses } = response.data.message;
          setUser({ name, email, courses });

          // Fetch details for each registered course
          if (courses && courses.length > 0) {
            fetchCourseDetails(courses);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchCourseDetails = async (courseIds) => {
      try {
        const courseDetailsPromises = courseIds.map((courseId) =>
          getCourseById(courseId)
        );
        const coursesData = await Promise.all(courseDetailsPromises);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Function to fetch course details by ID
  const getCourseById = async (courseId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/course/${courseId}/`
      );
      console.log(response.data.message);
      return response.data.message;
    } catch (error) {
      console.error(`Error fetching course with ID ${courseId}:`, error);
      return null;
    }
  };

  return (
    <div className="p-6 mt-36">
      {/* User Information */}
      <div className="mb-6 p-4 bg-gray-900 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">User Dashboard</h2>
        <p className="mt-2 text-lg">Name: {user.name}</p>
        <p className="text-lg">Email: {user.email}</p>
      </div>

      {/* Registered Courses Section */}
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Registered Courses</h3>
        {courses.length > 0 ? (
          <ul className="space-y-4">
            {courses.map((course) =>
              course ? (
                <li
                  key={course.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-lg text-black font-bold">
                      {course.title}
                    </h4>
                    <p className="text-gray-700">{course.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/course/view/${course._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    View Course
                  </button>
                </li>
              ) : null
            )}
          </ul>
        ) : (
          <p className="text-gray-600">No registered courses found.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
