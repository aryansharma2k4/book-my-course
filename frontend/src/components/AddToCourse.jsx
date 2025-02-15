import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

function AddToCourse() {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [course, setCourse] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { courseid } = useParams();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      toast("Please login or create an account to continue");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/v1/course/${courseid}/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(response => {
        setCourse({ title: response.data.message.title, description: response.data.message.description });
      })
      .catch(() => {
        toast.error("Failed to fetch course details");
      });
  }, [courseid, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowModal(true);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !thumbnail) {
      toast.error("All fields are required");
      return;
    }
  
    setUploading(true);
    setProgress(0);
  
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title);
      formData.append("thumbnail", thumbnail);
      formData.append("description", description);
  
      console.log("Uploading video...");
      const uploadResponse = await axios.post("http://127.0.0.1:8000/api/v1/video/publishVideo", formData, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
  
      console.log("Upload Response:", uploadResponse);
      if (!uploadResponse.data || !uploadResponse.data.data || !uploadResponse.data.data._id) {
        throw new Error("Invalid response from video upload API");
      }
  
      const videoId = uploadResponse.data.data._id;
      console.log("Video ID:", videoId);
  
      if (!videoId) {
        toast.error("Failed to retrieve video ID");
        return;
      }
      console.log(videoId);
      console.log("Adding video to course...");
      await axios.post(`http://127.0.0.1:8000/api/v1/course/addvideotocourse?videoId=${videoId}&courseId=${courseid}`, 
        {}, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      console.log("Video successfully added to course.");
      toast.success("Video added to course successfully");
  
      setVideos(prevVideos => [...prevVideos, { name: file.name }]);
      setFile(null);
      setTitle('');
      setThumbnail(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to upload video or add to course.");
    }
  
    setUploading(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen pt-24 flex flex-col items-center bg-black py-36 text-white mt-24">
      <div className="max-w-4xl w-full bg-[#09090b] p-6 rounded-lg shadow">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <p className="mt-2 text-gray-300">{course.description}</p>
        <hr className="border border-green-300 w-full my-4 mb-8" />

        <div className="mt-6">
          <h2 className="text-xl font-semibold">Add to the Playlist:</h2>
          <ul className="mt-2">
            {videos.map((video, index) => (
              <li key={index} className="border p-2 border-green-300 rounded-xl bg-[#09090b] my-2 flex items-center">
                <span className="h-full w-10 text-center px-3 py-1 text-2xl text-white bg-black mr-3 rounded">
                  {index + 1}.
                </span>
                <span>{video.name}</span>
              </li>
            ))}
          </ul>

          <label className="block mt-4 cursor-pointer bg-[#09090b] border-dashed border-2 border-green-300 text-white py-2 px-4 rounded-lg">
            {uploading ? "Uploading..." : "Add Video"}
            <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
          </label>

          {uploading && (
            <div className="w-full bg-gray-300 h-2 mt-2 rounded">
              <div className="bg-green-500 h-2 rounded" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white">
          <div className="bg-[#09090b] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Enter Video Details</h2>
            <input type="text" className="border p-2 w-full mb-2" placeholder="Video Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" className="border p-2 w-full mb-2" placeholder="Video Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="file" className="border p-2 w-full mb-4" onChange={(e) => setThumbnail(e.target.files[0])} />
            <div className="flex justify-end">
              <button className="border-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-green-300 text-black px-4 py-2 rounded" onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>
      )}
      <button className="mt-6 cursor-pointer hover:bg-green-400 transition border-green-300 border-2 font-bold text-white px-6 py-2 rounded-xl" onClick={() => navigate(`/course/view/${courseid}`)}>Done</button>
    </div>
  );
}

export default AddToCourse;
