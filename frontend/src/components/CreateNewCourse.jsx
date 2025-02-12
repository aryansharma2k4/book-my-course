import React from 'react'

function CreateNewCourse() {
    const handleSubmit=(e)=>{
        //logic add kro
    }
  return (
    <div className='min-h-screen mt-24 mx-24 bg-white text-black flex flex-col gap-y-4'>
        <span className='text-5xl font-bold pt-12'>Set up your course</span>
        <hr className='border-0.5 border-grey-300 w-full mt-4'/>

      <form className='mt-4' onSubmit={handleSubmit()}>
        <label className='py-4 font-light'>Title
      <input className='border border-gray-300 rounded-lg text-gray-700 p-2 mt-2 w-full' type='text' name='coursetitle' placeholder='Course title' required />
      </label>
      <label className='py-4 font-light mt-4'>Description
        <textarea
                className="border border-gray-300 rounded-lg text-gray-700 p-2 mt-2 w-full"
                placeholder="Your Message"
                rows="5"
                name="message"
                required
              ></textarea></label>
      </form>
      <button type='submit' className='py-1 bg-black text-white rounded hover:scale-105 hover:bg-white hover:text-black px-2 border-1 border-grey-300 cursor-pointer'>Submit</button>
    </div>
  )
}

export default CreateNewCourse;
