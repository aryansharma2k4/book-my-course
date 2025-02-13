import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AddToCourse() {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Hardcoded course details
  const course = {
    title: "Mastering React",
    description: "A comprehensive guide to building modern web applications with React.js.",
  };

  // Simulate video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    // Fake upload simulation
    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += 10;
      setProgress(fakeProgress);
      if (fakeProgress >= 100) {
        clearInterval(interval);
        toast.success("Video uploaded successfully");
        setVideos([...videos, { name: file.name }]);
        setUploading(false);
        setProgress(0);
      }
    }, 200);
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      toast("Please login or create an account to continue");
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 flex flex-col items-center bg-white py-36 text-black mt-24">
      <div className="max-w-4xl w-full bg-gray-100 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="mt-2 text-gray-700">{course.description}</p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold">Add to the Playlist:</h2>
          <ul className="mt-2">
  {videos.map((video, index) => (
    <li key={index} className="border p-2 rounded bg-white my-2 flex items-center">
    <span className="h-full w-10 text-center px-3 py-1 text-2xl text-white bg-black mr-3 rounded">
      {index + 1}.
    </span>
    <span>{video.name}</span>
  </li>  
  ))}
</ul>

          <label style={{ borderStyle: "dashed", borderWidth: "2px", borderSpacing: "10px", borderImage: "none" }} className="block mt-4 cursor-pointer bg-white border-dashed border border-gray-400 text-black py-2 px-4 rounded-lg">
            {uploading ? "Uploading..." : "Add Video"}
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
          </label>

          {uploading && (
            <div className="w-full bg-gray-300 h-2 mt-2 rounded">
              <div className="bg-green-500 h-2 rounded" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddToCourse;
