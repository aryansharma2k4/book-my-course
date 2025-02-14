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
        const response = await axiosInstance.get(`http://127.0.0.1:8000/api/v1/video/${videoid}`);
        console.log(response);
        setVideoData(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    if (videoid) fetchVideo();
  }, []);

  console.log(videoData && videoData.message.videoFile);

  const title = videoData && videoData.message.title;
  const description = videoData && videoData.message.description;

  const url = videoData && videoData.message.videoFile;
  
  

  if (!videoData) {
    return (
      <div className='min-h-screen flex flex-col items-center bg-white py-36 text-black'>
      <p className='text-center mt-20 text-lg'>Loading video...</p>
    </div>
  );
  }

  return (
    <div className='min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-700 py-36 text-white px-4 sm:px-8'>
  <div className='w-full max-w-full aspect-video'>
    <ReactPlayer
      className='w-full h-full'
      width="100%"
      height="100%"
      autoplay
      loop={false}
      controls
      playing
      url={url}
    />
  </div>
  <div className='flex flex-col mt-2 gap-y-4 w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[60%]'>
    <div className='flex flex-col gap-y-2'>
      <h1 className='text-2xl font-bold'>{title}</h1>
      <p className='text-lg mb-4'>{description}</p>
    </div>
  </div>
</div>


  );
}

export default Video;
