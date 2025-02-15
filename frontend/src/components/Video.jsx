import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Video() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");

  const { videoid } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [courseVideos, setCourseVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosInstance = axios.create({
    timeout: 5000,
  });

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `http://127.0.0.1:8000/api/v1/video/${videoid}`
        );
        setVideoData(response.data.message);
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    if (videoid) fetchVideo();
  }, [videoid]);

  useEffect(() => {
    const fetchCourseVideos = async () => {
      try {
        const response = await axiosInstance.get(
          `http://127.0.0.1:8000/api/v1/course/${courseId}`
        );

        const videoIds = response.data.message.videos || [];

        // Fetch each video's details in parallel
        const videoDetailsPromises = videoIds.map(async (id) => {
          try {
            const res = await axiosInstance.get(
              `http://127.0.0.1:8000/api/v1/video/${id}`
            );
            return res.data.message;
          } catch (error) {
            console.error(`Error fetching details for video ${id}:`, error);
            return null;
          }
        });

        // Wait for all API calls to complete
        const videoDetails = await Promise.all(videoDetailsPromises);

        // Filter out failed requests (null values)
        setCourseVideos(videoDetails.filter((video) => video !== null));
      } catch (err) {
        console.error("Error fetching course videos:", err);
      }
    };

    fetchCourseVideos();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-black text-white">
        <p className="text-center mt-20 text-lg">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex gap-8 bg-black py-12 mt-24">
      {/* Video Player Section */}
      <div className="w-[75%]">
        <ReactPlayer
          width="100%"
          height="600px"
          url={videoData.videoFile}
          playing
          controls
        />
        <h1 className="text-4xl font-bold text-white mt-4">
          {videoData.title}
        </h1>
        <p className="text-gray-300 text-lg mt-2">{videoData.description}</p>
      </div>

      {/* Playlist Section */}
      <div className="w-[25%] bg-gray-900 text-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Playlist</h2>
        <ul className="space-y-3">
          {courseVideos.map((video) => (
            <li
              key={video._id}
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${
                video._id === videoid
                  ? "border-green-400 border-2 bg-green-900 font-bold"
                  : "hover:bg-gray-600"
              }`}
              onClick={() =>
                navigate(`/video/${video._id}?courseId=${courseId}`)
              }
            >
              <div className='px-6'>
                <h3 className="text-sm text-white font-semibold">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Video;
