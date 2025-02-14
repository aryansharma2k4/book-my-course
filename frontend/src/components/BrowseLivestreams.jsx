import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BrowseLivestreams() {
  const [livestreams, setLivestreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/livestream/all');
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
    console.log("Initial livestreams:", livestreams);
  }, []);

  useEffect(() => {
    console.log("Updated livestreams:", livestreams);
  }, [livestreams]);

  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16 min-h-screen bg-black">
      <div className="w-full max-w-4xl mt-24 p-6 md:p-8 bg-[#09090b] text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Browse Livestreams</h1>
        {loading ? (
          <p className="text-center">Loading livestreams...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : livestreams.length === 0 ? (
          <p className="text-center">No livestreams available.</p>
        ) : (
          <ul className="space-y-6">
            {livestreams.map((livestream) => (
              <li
                key={livestream._id}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-2xl font-semibold mb-2">{livestream.title}</h2>
                <p className="text-gray-600 mb-4">{livestream.description}</p>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => navigate(`/viewStream/${livestream._id}`)}
                >
                  Watch
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BrowseLivestreams;
