import React from 'react'
import ReactPlayer from 'react-player'

function Video() {
  return (
    <div>
      <div className='min-h-screen flex bg-pink-100 py-36 justify-center'>
        <ReactPlayer controls playing url="https://www.youtube.com/watch?v=TdW55juUJRo"/>
      </div>
    </div>
  )
}

export default Video
