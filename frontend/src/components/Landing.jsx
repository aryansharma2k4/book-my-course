import React from "react";
import landingImage from "../assets/landing-image.jpg"; // Replace with the correct image path
import { useNavigate } from "react-router-dom";
import RotatingText from "./ext/RotatingText";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-24 flex flex-col md:flex-row items-center mt-12 bg-white px-6 md:px-12">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-start text-center md:text-left space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          BookMyCourse is your one stop solution for{"  "}
          <RotatingText
            texts={["Courses", "Webinars", "Events", "Lectures"]}
            mainClassName="px-2 bg-cyan-300 text-black rounded-lg inline-block"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </h1>
        <p className="text-lg text-gray-600">
          Join us today and start learning!
        </p>

        <div className="flex flex-row md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <button
          onClick={() => navigate("/courses")}
          className="mt-4 bg-cyan-400 hover:bg-cyan-500 text-black text-lg font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg cursor-pointer" 
        >
          Browse course
        </button>
        <button
          onClick={() => navigate("/showlivestreams")}
          className="mt-4 bg-cyan-400 hover:bg-cyan-500 text-black text-lg font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg cursor-pointer" 
        >
          Browse Livestreams
        </button>
      </div></div>

      {/* Right Image */}
      <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
        <img
          src={landingImage}
          alt="Landing"
          className="max-w-full md:max-w-lg h-auto rounded-lg shadow-lg"
          draggable={false}
        />
      </div>
    </div>
  );
}

export default Landing;
