import React from "react";
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
        data
      );
      console.log(response);
      toast.success("Course created successfully");
      navigate("/");
    } catch (e) {
      console.log(e);
      toast.error("Error creating course");
    }
  };

  return (
    <div className="min-h-screen pt-24 mx-24 bg-white text-black flex flex-col gap-y-4">
      <span className="text-5xl font-bold pt-12">Set up your course</span>
      <hr className="border-0.5 border-grey-300 w-full mt-4" />

      <form className="mt-4 flex flex-col flex-1 gap-y-4" onSubmit={handleSubmit}>
        <label className="font-light flex">
          Title:
          <input
            className="border border-gray-300 rounded-lg text-gray-700 ml-8  mt-1 px-2 py-1 w-1/2"
            type="text"
            name="coursetitle"
            placeholder="Course title"
            required
          />
        </label>
        <label className="font-light">
          Description
          <textarea
            className="border border-gray-300 rounded-lg text-gray-700 p-2 mt-1 w-full"
            placeholder="Course Description"
            rows="5"
            name="coursedescription"
            required
          />
        </label>
        <label className= "font-light">
          Price
          <input
            className="border border-gray-300 rounded-lg text-gray-700 p-2 mt-1 w-full"
            type="number"
            name="courseprice"
            placeholder="Price"
            required
          />
          </label>
        <button
          type="submit"
          className="py-1 bg-black text-white rounded transition hover:bg-white hover:text-black px-2 border-1 border-grey-300 cursor-pointer"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default CreateNewCourse;
