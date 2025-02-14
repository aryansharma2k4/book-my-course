import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function StreamView() {
  const { streamid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startStream = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/livestream/live/${streamid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log(response);
      navigate(`/ext/${streamid}`);
    } catch (error) {
      console.error("Error starting stream:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Ready to Start Your Stream?</h1>
        <button 
          onClick={startStream}
          disabled={loading}
          className="px-6 py-3 bg-cyan-300 text-black rounded hover:bg-cyan-400 transition-colors duration-300"
        >
          {loading ? "Starting Stream..." : "Continue to streaming details"}
        </button>
      </div>
    </div>
  );
}

export default StreamView;
