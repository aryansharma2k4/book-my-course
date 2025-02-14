import React,{useState} from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

function LiveStreamDetails() {
    const [title, setTitle] = useState('');
    const [description, setDescription]=useState('');
    const livestreamId=useParams();
    useEffect(() => {
        const fetchLiveStreamDetails = async () => {
          try {
            console.log(livestreamId.streamid)
            const response = await axios.get(
                `http://127.0.0.1:8000/api/v1/livestream/stream/${livestreamId.streamid}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.accessToken}`,
                  },
                });
            console.log(response);
            setTitle(response.data.message.title);
            setDescription(response.data.message.description);
          } catch (error) {
            console.error('Error fetching livestream details:', error);
          }
        };
    
        fetchLiveStreamDetails();
      }, [livestreamId]);
    
  return (
    <div className="mt-24 flex-1 flex justify-center p-8 md:p-12 lg:p-16 min-h-screen">
      <div className="flex flex-1 flex-col gap-y-4 bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className='text-8xl'>Livestream details</h1>
        <hr className="border border-gray-300 w-full mx-auto my-4" />
        <h1 className="text-4xl font-bold">{title}</h1>
        <hr className="border border-gray-300 w-full mx-auto my-4" />
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

export default LiveStreamDetails
