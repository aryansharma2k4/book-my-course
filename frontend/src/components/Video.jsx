import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Video() {
  const { videoid } = useParams();
  const [ videoData, setVideoData] = useState(null)

  console.log(videoid);
  

  
  const axiosInstance = axios.create({
    timeout: 5000
  })

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/video/${videoid}`);
        setVideoData(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    if (videoid) fetchVideo();
  }, []);

  console.log(videoData && videoData.message.videoFile);

  const url = videoData && videoData.message.videoFile;
  
  

  if (!videoData) {
    return <p className='text-center mt-20 text-lg'>Loading video...</p>;
  }

  return (
    <div className='min-h-screen flex flex-col items-center bg-white py-36 text-black'>
      <h1 className='text-2xl font-bold mb-4'>{videoData.title}</h1>
      <p className='text-lg mb-4'>{videoData.description}</p>
      <ReactPlayer autoplay loop={false} controls playing url={url} />
    </div>
  );
}

export default Video;
