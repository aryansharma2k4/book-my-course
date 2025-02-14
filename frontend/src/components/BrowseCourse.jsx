import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        console.log("Fetched courses:", response.data.message);
      } catch (err) {
        console.error("Error fetching courses: ", err);
        setError("Error fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    console.log("Initial courses:", Courses);
  }, []);

  useEffect(() => {
    console.log("Updated courses:", Courses);
  }, [Courses]);

  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16 min-h-screen bg-black">
      <div className="w-full max-w-4xl mt-24 p-6 md:p-8 bg-[#09090b] text-white rounded-lg ">
        <h1 className="text-3xl font-bold ">Browse Courses</h1>
        <hr className='w-full my-8'/>
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
                className="p-6 border flex justify-between border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div><h2 className="text-2xl font-semibold mb-2">{Course.title}</h2>
                <p className="text-gray-300 mb-4">{Course.description}</p></div>
                
                <button
                  className="border-cyan-300 border-2 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => navigate(`../course/view/${Course._id}`)}
                >
                  View Course
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BrowseCourse;
