import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Livepeer } from 'livepeer';
import { useParams } from 'react-router-dom';
import { getSrc } from '@livepeer/react/external';
import Hls from "hls.js";

function LiveStreamView() {
  const videoRef = useRef();
  const [source, setSource] = useState(null);
  const LIVEPEERAPI = import.meta.env.VITE_LIVEPEER_API_KEY;
  const livepeer = new Livepeer({
    apiKey: LIVEPEERAPI,
  });

  const { streamId } = useParams();

  const getPlaybackId = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/getLive/${streamId}`);
      const playbackId = response.data.message;
      const playbackInfo = await livepeer.playback.get(playbackId);
      const srcArray = getSrc(playbackInfo.playbackInfo);
      if (srcArray && srcArray.length > 0) {
        setSource(srcArray[0].src);
      }
    } catch (err) {
      console.error("Error fetching playback info:", err);
    }
  };

  // This effect runs when 'source' updates
  useEffect(() => {
    if (source && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = source;
      }
    }
  }, [source]);

  return (
    <div className="mt-24 flex flex-1 flex-col justify-center">
        <div className='pt-8 flex flex-col gap-y-4 bg-gradient-to-br from-gray-900 to-gray-700 p-6 md:p-8 shadow-lg'>

      <video className='self-center w-full h-full' ref={videoRef} autoPlay controls width="600"></video>
      <button className='bg-cyan-300 px-2 py-1 rounded-lg w-1/5 cursor-pointer' onClick={getPlaybackId}>Click here to join the Stream!</button>
        </div>
      
    </div>
  );
}

export default LiveStreamView;
