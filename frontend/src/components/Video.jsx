import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Video() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');
  
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

        const videoIds = response.data.message.videos;

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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-white py-36 text-black">
        <p className="text-center mt-20 text-lg">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="my-36 flex gap-8 px-8">
      {/* Video Player Section */}
      <div className="w-[75%]">
        <ReactPlayer width="100%" height="600px" url={videoData.videoFile} playing controls />
        <h1 className="text-black text-3xl font-bold mt-4">{videoData.title}</h1>
        <p className="text-black text-lg mt-2">{videoData.description}</p>
      </div>

      <div className="w-[25%] text-black bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Playlist</h2>
        <ul className="space-y-3">
          {courseVideos.map((video) => (
            <li
              key={video._id}
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${
                video._id === videoid ? "bg-gray-300 font-bold" : "hover:bg-gray-200"
              }`}
              onClick={() => navigate(`/video/${video._id}`)}
            >
              <div>
                <h3 className="text-sm font-semibold">{video.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{video.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Video;