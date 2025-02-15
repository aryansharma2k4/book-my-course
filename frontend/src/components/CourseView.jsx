import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function CourseView() {
  const { courseid } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      toast.error('Please login or create an account to continue');
      return;
    }

    const fetchCourseData = async () => {
      try {
        const courseRes = await axios.get(`http://127.0.0.1:8000/api/v1/course/${courseid}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setTitle(courseRes.data.message.title);
        setDescription(courseRes.data.message.description);

        const videoIds = courseRes.data.message.videos || [];

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
      } catch (error) {
        toast.error('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseid, navigate]);

  return (
    <div className="mt-24 flex justify-center p-6 md:p-10 min-h-screen bg-black text-white">
      <div className="w-full max-w-3xl bg-[#09090b] p-6 md:p-8 rounded-lg shadow-lg text-center">
        {loading ? (
          <p className="text-center text-lg text-gray-300">Loading course...</p>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-white text-start">{title}</h1>
            <hr className="border border-gray-500 w-full mx-auto my-4" />
            <p className="text-gray-300 text-xl font-semibold text-start">{description}</p>

            <h2 className="text-xl font-semibold mt-6 text-start">Videos</h2>
            <hr className="border border-gray-500 w-full mx-auto mb-8 mt-2" />

            {videos.length > 0 ? (
              <div className="mt-4">
                {videos.map((video, index) => (
                  <Link
                    key={video.id}
                    to={`/video/${video.id}?courseId=${courseid}`}
                    className="block py-2 px-4 mt-2 last:border-none text-lg text-start font-medium bg-gray-900 rounded-sm text-white hover:bg-gray-700 transition duration-200"
                  >
                    {index + 1}. {video.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No videos available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CourseView;
