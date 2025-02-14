import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Livepeer } from "livepeer";
import { getSrc } from "@livepeer/react/external";
import axios from "axios";

const LiveStream = () => {
  const videoRef = useRef(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    const LIVEPEERAPI=import.meta.env.VITE_LIVEPEER_API_KEY;
    const livepeer = new Livepeer({
      apiKey: `${LIVEPEERAPI}`,
    });

    const fetchPlayback = async () => {
      try {
        const playbackId = await axios.post("http://localhost:8000/api/v1/livestream/getStream");
        const playbackInfo = await livepeer.playback.get(playbackId);
        const srcArray = getSrc(playbackInfo.playbackInfo);

        if (srcArray && srcArray.length > 0) {
          console.log((srcArray[0].src));
          
          setSource(srcArray[0].src);
        }
      } catch (error) {
        console.error("Error fetching playback info:", error);
      }
    };

    fetchPlayback();
  }, []);

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
    <div>
      {source ? (
        <video ref={videoRef} className="w-80%" controls></video>
      ) : (
        <p>Loading stream...</p>
      )}
    </div>
  );
};

export default LiveStream;
