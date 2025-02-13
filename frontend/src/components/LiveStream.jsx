// import { useState, useEffect } from "react";
// import { getSrc } from "@livepeer/react/external"; // Correct external import
// import { createClient } from "livepeer"; // Correct import for client creation
// import axios from "axios";
import React from "react";

// Initialize Livepeer client
// const livepeer = createClient({
//   apiKey: import.meta.env.VITE_LIVEPEER_API_KEY, // Use Vite's env variable
// });

const LiveStream = () => {
//   const [videoSrc, setVideoSrc] = useState("");

//   const playbackId = "98afzh7k2drbe557"; // Replace with dynamic ID if needed

//   useEffect(() => {
//     const fetchPlaybackSource = async () => {
//       try {
//         const playbackData = await livepeer.playback.get(playbackId);

//         if (playbackData) {
//           const src = getSrc(playbackData.playbackInfo);
//           setVideoSrc(src);
//           console.log("Video Source:", src);
//         }
//       } catch (error) {
//         console.error("Error fetching playback info:", error);
//       }
//     };

//     fetchPlaybackSource();
//   }, [playbackId]);

  return (
    <>
      <video width="640" height="480" controls autoPlay src= "https://livepeercdn.studio/hls/4af6xfj20fqi8ds7/index.m3u8"></video>
    </>
  );
};

export default LiveStream;
