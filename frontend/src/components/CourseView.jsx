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
    <div className="mt-24 flex justify-center p-6 md:p-10 min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-lg shadow-md">
        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading course...</p>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            <hr className="border border-gray-300 w-full mx-auto my-4" />
            <p className="text-gray-700 text-xl font-semibold">{description}</p>

            <h2 className="text-2xl font-semibold mt-6">Videos</h2>

            {videos.length > 0 ? (
              <div className="mt-4">
                {videos.map((video, index) => (
                  <Link
                    key={video.id}
                    to={`/video/${video.id}?courseId=${courseid}`}
                    className="block py-3 px-4 border-b font-semibold last:border-none text-lg font-medium bg-gray-200 rounded-xl text-gray-800 hover:bg-gray-300 transition duration-200"
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
