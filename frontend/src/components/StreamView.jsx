import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function StreamView() {

    const stream = useParams();
    const navigate = useNavigate();
    const streamId = stream.streamid
    
    const startStream = async() => {
        const response = await axios.get(
            `http://127.0.0.1:8000/api/v1/livestream/live/${streamId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
              },
            });
            console.log(response);
            navigate(`/ext/${streamId}`)
            
            
    }

  return (
    <div className='mt-24'>
      <button className='bg-black w-10% text-white' onClick={startStream}>Click Me</button>
    </div>
  )
}

export default StreamView
