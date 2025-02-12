import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';

function Video() {
  const { data } = useParams();
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    url: 'http://res.cloudinary.com/deniaaly2/video/upload/v1739382940/wfh1jvhjgdcgz7mfbedn.mp4' // Default URL for development purposes
  });

  useEffect(() => {
    // Fetch video data based on params (for development, using static data)
    if (data) {
      setVideoData({
        title: 'Sample Video',
        description: 'This is a sample video description.',
        thumbnail: 'https://via.placeholder.com/150',
        url: 'http://res.cloudinary.com/deniaaly2/video/upload/v1739382940/wfh1jvhjgdcgz7mfbedn.mp4'
      });
    }
  }, [data]);

  return (
    <div className='min-h-screen flex flex-col items-center bg-white py-36 text-black'>
      <h1 className='text-2xl font-bold mb-4'>{videoData.title}</h1>
      <p className='text-lg mb-4'>{videoData.description}</p>
      <ReactPlayer loop={false} controls playing url={videoData.url} />
    </div>
  );
}

export default Video;
