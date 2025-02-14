import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function BrowseCourse() {
    const [Courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

    useEffect(()=>{
        const fetchCourses = async () => {
            try {
              const response = await axios.get('http://127.0.0.1:8000/api/v1/course/all');
              // Assuming response.data.message is an array of livestreams
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
          // This log will show the initial state (empty array) because state hasn't updated yet
          console.log("Initial livestreams:", Courses);
    },[])



  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-2xl h-full mt-24 p-6 md:p-8 bg-white rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4">Browse Courses</h1>
      <ul className="space-y-4">

            {Courses && Courses.map((Course) => (
              <li
                key={Course._id} // Adjust this if your unique id is different
                className="p-4 border border-gray-200 rounded hover:shadow transition-shadow duration-200"
              >
                <h2 className="text-xl font-semibold">{Course.title}</h2>
                <p className="mt-2 text-gray-600">{Course.description}</p>
                <button className='bg-blue-400 p-2 self-end rounded-lg' onClick={()=>navigate(`../course/view/${Course._id}`)}>Watch</button>
              </li>
            ))}
          </ul>

    </div>
    </div>
  )
}

export default BrowseCourse
