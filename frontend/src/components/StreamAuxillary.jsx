import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function StreamAuxillary() {
  const { streamid } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Optionally, if your API returns a dedicated stream URL, you can store it
  const [streamURL, setStreamURL] = useState('');

  const streamkey='';

  useEffect(() => {
    const fetchLiveStreamDetails = async () => {
      try {
        console.log("Fetching details for streamid:", streamid);
        console.log(streamid);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/users/getStreamKey/${streamid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        console.log("Response:", response);
        // Adjust these property names based on your API response
        const { title, description, streamURL } = response.data.message;
        setTitle(title);
        setDescription(description);
        setStreamURL(streamURL || ''); // If provided by the API
      } catch (error) {
        console.error('Error fetching livestream details:', error);
      }
    };

    fetchLiveStreamDetails();
  }, [streamid]);

  return (
    <div className="mt-24 min-h-screen flex flex-col items-center bg-white py-16 px-4 text-black">
      <h1 className="text-5xl font-bold mb-8">Stream is Running</h1>
      <div className="max-w-3xl w-full">
        <h2 className="text-3xl font-semibold mb-4">{title || "Live Stream"}</h2>
        <p className="text-lg mb-6">{description || "Your stream is almost live! Follow the steps below:"}</p>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">How to Stream on OBS</h3>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Download OBS Studio for your device from <a className='text-blue-700 underline' href="https://obsproject.com/download">https://obsproject.com/download</a> and follow the steps for installation.</li>
            <li>Open OBS Studio.</li>
            <li>
              Click on <strong>Settings</strong> in the lower right corner.
            </li>
            <li>
              Go to the <strong>Stream</strong> tab.
            </li>
            <li>
              For <strong>Service</strong>, select <strong>Livepeer Studio</strong>.
            </li>
            <li>
              In the <strong>Stream Key</strong> field, enter the below Stream Key:
              <br />
              <code>{streamkey}</code>
            </li>
            <li>
              Click <strong>Apply</strong> and then <strong>OK</strong> to save the settings.
            </li>
            <li>
              Finally, click <strong>Start Streaming</strong> in OBS.
            </li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            You're all set! Your stream will now be live on the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StreamAuxillary;
