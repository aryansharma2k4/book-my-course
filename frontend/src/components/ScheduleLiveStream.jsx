import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

function ScheduleLiveStream() {
    const navigate=useNavigate();
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          navigate("/login");
          toast("Please login or create an account to continue");
        }
      }, []);

    const handleSubmit=async(e)=>{
        e.preventDefault();

        const data = {
            title: e.target.livestreamtitle.value,
            description: e.target.livestreamdescription.value,
            price: e.target.livestreamprice.value,
            date: e.target.startdatetime.value
        };
        console.log(data);

        try {
            const response = await axios.post(
              "http://127.0.0.1:8000/api/v1/livestream/schedule",
              data,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
              }
            );
          
            console.log(response);
            toast.success("Course created successfully");
            // navigate(`/course/edit/${response.data.message._id}`);
          } catch (error) {
            console.error("Error scheduling livestream", error);
            toast.error("Failed to schedule livestream. Please try again.");
          }

    }
  return (
    <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-8xl h-full mt-24 p-6 md:p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold pt-4">Schedule a Livestream</h1>
        <hr className="border border-gray-300 w-full my-4" />
        <form className="mt-4 flex flex-col gap-y-4" onSubmit={handleSubmit}>
          <label className="w-full">
            Title:
            <input
              className="border border-gray-300 rounded-lg text-gray-700 w-full mt-1 px-3 py-2"
              type="text"
              name="livestreamtitle"
              placeholder="Livestream title"
              required
            />
          </label>
          <label className="w-full">
            Description:
            <textarea
              className="border border-gray-300 rounded-lg text-gray-700 w-full mt-1 p-3"
              placeholder="Livestream Description"
              rows="5"
              name="livestreamdescription"
              required
            />
          </label>
          <label className="w-full">
            Price:
            <input
              className="border border-gray-300 rounded-lg text-gray-700 w-full mt-1 px-3 py-2"
              type="number"
              name="livestreamprice"
              placeholder="Price"
              required
            />
          </label>
          <label className="w-full">
  Set starting date & time
  <input
    className="border border-gray-300 rounded-lg text-gray-700 w-full mt-1 px-3 py-2"
    type="datetime-local"
    name="startdatetime"
    required
  />
</label>

          <button
            type="submit"
            className="py-2 px-4 bg-black text-white rounded-lg transition hover:scale-105 hover:bg-white hover:text-black border border-gray-300 cursor-pointer w-full md:w-1/3 mx-auto mt-4"
          >
            Continue
          </button>
        </form>
    </div>
    </div>
  )
}

export default ScheduleLiveStream
