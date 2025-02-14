import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
import { Video } from "../models/video.model.js"; 
import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { Educator } from "../models/educator.model.js";
import { Livestream } from "../models/livestream.model.js";



const initializeCourse = asyncHandler(async (req, res) => {
    const { title, description, price } = req.body;

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "All fields are required");
    }
    if(price < 0) throw new ApiError(400, "Price cannot be negative");

    const course = await Course.create({
        title: title.trim(),
        description: description.trim(),
        owner: req.user?._id,
        price,
        videos: []
    });

    res.status(201).json(new ApiResponse(201, "Course initialized successfully", course));
});

const addVideoToCourse = asyncHandler(async (req, res) => {
    const { videoId, courseId } = req.query;

    
    if(!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");
    if(!isValidObjectId(courseId)) throw new ApiError(400, "Invalid course ID");

    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, "Course not found");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    // Prevent duplicate videos
    if (course.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in this course");
    }

    course.videos.push(videoId);
    await course.save();

    res.status(200).json(new ApiResponse(200, "Video added to course successfully", await course.populate("videos")));
});

const getAllCourses = asyncHandler(async(req, res) => {
    const courses = await Course.find().lean();
    return res.status(200).json(new ApiResponse(200, "All courses fetched", courses))
})

const getCourseById = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    if(!isValidObjectId(courseId)) throw new ApiError(400, "Invalid course ID");

    const course = await Course.findById(courseId)
    if(!course) throw new ApiError(404, "Course not found");

    res.status(200).json(new ApiResponse(200, "Course retrieved successfully", course));
});

export { initializeCourse, addVideoToCourse, getCourseById };
