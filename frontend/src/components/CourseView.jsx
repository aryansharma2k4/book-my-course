import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // ✅ Import Link
import axios from 'axios';
import toast from 'react-hot-toast';

function CourseView() {
  const { courseid } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      toast.error('Please login or create an account to continue');
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/v1/course/${courseid}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setTitle(response.data.message.title);
        setDescription(response.data.message.description);
        return response.data.message.videos || [];
      })
      .then(async (videoIds) => {
        const videoDetails = await Promise.all(
          videoIds.map(async (videoId) => {
            try {
              const res = await axios.get(`http://127.0.0.1:8000/api/v1/video/${videoId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              return { id: videoId, title: res.data.message.title };
            } catch {
              return { id: videoId, title: 'Unknown Video' };
            }
          })
        );
        setVideos(videoDetails);
      })
      .catch(() => {
        toast.error('Failed to fetch course details');
      });
  }, [courseid, navigate]);

  return (
    <div className="mt-24 flex-1 flex justify-center p-8 md:p-12 lg:p-16 min-h-screen">
      <div className="flex flex-1 flex-col gap-y-4 bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">{title}</h1>
        <hr className="border border-gray-300 w-full mx-auto my-4" />
        <p className="text-gray-600">{description}</p>
        <h2 className="text-2xl font-semibold mt-4">Videos</h2>
        {videos.length > 0 ? (
          <ul className="list-disc pl-5">
            {videos.map((video) => (
              <li key={video.id} className="text-gray-800">
                <Link className="text-blue-600 cursor-pointer" to={`/video/${video.id}`}>
                  {video.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No videos available</p>
        )}
      </div>
    </div>
  );
}

export default CourseView;
