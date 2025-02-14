import React from "react";
import landingImage from "../assets/landing-image.jpg"; // Replace with the correct image path
import { useNavigate } from "react-router-dom";
import RotatingText from "./ext/RotatingText";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-24 flex flex-col md:flex-row items-center mt-12 bg-[#09090b] text-white px-6 md:px-12">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-start text-center md:text-left space-y-4">
        <h1 className="text-5xl md:text-5xl font-bold leading-tight">
          Cognitio is your one stop solution for{"  "}
          <RotatingText
            texts={["Courses", "Webinars", "Events", "Lectures"]}
            mainClassName="px-2 mt-1 bg-black border-2 border-green-300 text-white rounded-lg inline-block"
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
        <p className="text-lg text-gray-300">
          Join us today and start learning!
        </p>

        <div className="flex flex-row md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <button
          onClick={() => navigate("/showcourses")}
          className="mt-4 border-green-300 border-2 hover:bg-green-600 text-white text-lg font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg cursor-pointer" 
        >
          Browse courses {">"}
        </button>
        <button
          onClick={() => navigate("/showlivestreams")}
          className="mt-4 border-green-300 border-2 hover:bg-green-600 text-white text-lg font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg cursor-pointer" 
        >
          Browse Livestreams {">"}
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
      <div>
        
      </div>
    </div>
  );
}

export default Landing;
