import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function BrowseCourse() {
  const [Courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/course/all');
        setCourses(response.data.message);
      } catch (err) {
        console.error('Error fetching courses: ', err);
        setError('Error fetching courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleRegister = async (courseId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }
      console.log(courseId);
      

       const response  = await axios.post(
        `http://127.0.0.1:8000/api/v1/users/registerCourse/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log(response);
      

      toast.success('Successfully registered for the course!');
    } catch (err) {
      toast.error("Error", error);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16 min-h-screen bg-black">
      <div className="w-full max-w-4xl mt-24 p-6 md:p-8 bg-[#09090b] text-white rounded-lg">
        <h1 className="text-3xl font-bold">Browse Courses</h1>
        <hr className="w-full my-8" />
        {loading ? (
          <p className="text-center">Loading courses...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : Courses.length === 0 ? (
          <p className="text-center">No courses available.</p>
        ) : (
          <ul className="space-y-6">
            {Courses.map((Course) => (
              <li
                key={Course._id}
                className="p-6 border flex justify-between items-center border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{Course.title}</h2>
                  <p className="text-gray-300 mb-4">{Course.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="border-green-400 border-2 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    onClick={() => handleRegister(Course._id)}
                  >
                    Register for Course
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BrowseCourse;
