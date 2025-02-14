import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BrowseLivestreams() {
  const [livestreams, setLivestreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/livestream/all');
        // Assuming response.data.message is an array of livestreams
        setLivestreams(response.data.message);
        console.log("Fetched livestreams:", response.data.message);
      } catch (err) {
        console.error("Error fetching livestreams: ", err);
        setError("Error fetching livestreams.");
      } finally {
        setLoading(false);
      }
    };

    fetchLivestreams();
    // This log will show the initial state (empty array) because state hasn't updated yet
    console.log("Initial livestreams:", livestreams);
  }, []);

  // Log updated state when livestreams changes
  useEffect(() => {
    console.log("Updated livestreams:", livestreams);
  }, [livestreams]);

  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16 min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl h-full mt-24 p-6 md:p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Browse Livestreams</h1>
        {loading ? (
          <p>Loading livestreams...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : livestreams.length === 0 ? (
          <p>No livestreams available.</p>
        ) : (
          <ul className="space-y-4">
            {livestreams.map((livestream) => (
              <li
                key={livestream._id} // Adjust this if your unique id is different
                className="p-4 border border-gray-200 rounded hover:shadow transition-shadow duration-200"
              >
                <h2 className="text-xl font-semibold">{livestream.title}</h2>
                <p className="mt-2 text-gray-600">{livestream.description}</p>
                <button className='bg-blue-400 p-2 self-end rounded-lg' onClick={()=>navigate(`/viewStream/${livestream._id}`)}>Watch</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BrowseLivestreams;
