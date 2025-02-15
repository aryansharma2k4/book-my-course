import React, { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CreateNewCourse() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title: e.target.coursetitle.value,
      description: e.target.coursedescription.value,
      price: e.target.courseprice.value,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/course/initializeCourse",
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
      navigate(`/course/edit/${response.data.message._id}`);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      toast("Please login or create an account to continue");
    }
  }, []);

  return (
    <div className="flex-1 flex bg-black justify-center items-center p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-2xl h-full mt-24 p-6 md:p-8 bg-[#09090b] rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold pt-4 text-white">Set up your course</h1>
        <hr className="border border-green-300 w-full my-4 mb-8" />

        <form className="mt-4 flex flex-col gap-y-4 text-white" onSubmit={handleSubmit}>
          <label className="w-full">
            Title:
            <input
              className="border border-gray-700 rounded-lg text-gray-200 w-full mt-1 px-3 py-2"
              type="text"
              name="coursetitle"
              placeholder="Course title"
              required
            />
          </label>
          <label className="w-full">
            Description:
            <textarea
              className="border border-gray-700 rounded-lg text-gray-200 w-full mt-1 p-3"
              placeholder="Course Description"
              rows="5"
              name="coursedescription"
              required
            />
          </label>
          <label className="w-full">
            Price:
            <input
              className="border border-gray-700 rounded-lg text-gray-200 w-full mt-1 px-3 py-2"
              type="number"
              name="courseprice"
              placeholder="Price"
              required
            />
          </label>
          <button
            type="submit"
            className="py-2 px-4 bg-black text-white rounded-lg font-bold transition hover:scale-105 hover:bg-white hover:text-black border border-green-300 cursor-pointer w-full md:w-1/3 mx-auto mt-4"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateNewCourse;
