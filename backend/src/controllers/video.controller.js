
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";



const publishVideo = asyncHandler(async(req, res) => {

    const {title, description} = req.body;
    if([title, description].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    //got the title and description of the video
    const videoLocalPath = req.files?.video?.[0]?.path;
    
    if(!videoLocalPath){
        throw new ApiError(400, "Video is Required");
    }
    const video = await uploadOnCloudinary(videoLocalPath);
    if(!video){
        throw new ApiError(400, "Failed to upload video on to Cloudinary")
    }
    const thumbnailLocalPath = req.files?.thumbnail?.[0].path;
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if(!thumbnail){
        throw new ApiError(400, "Failed to upload on cloudinary");
    }
    const owner = req.user?._id;
    const publishedVideo = await Video.create({
        videoFile : video.url,
        thumbnail : thumbnail.url,
        title,
        description,
        duration: video.duration,
        isPublished: true,
        owner

    })
    if(!publishedVideo){
        throw new ApiError(500, "Something went wrong while uploading the video");
    }
    return res.status(201)
    .json(new ApiResponse(200, publishedVideo, "Video uploaded Successfully"));

})

const getVideoById = asyncHandler(async(req, res) => {
    const { videoId } = req.params;
    if(!isValidObjectId(videoId)) throw new ApiError(404, "Not able to find the video with the given video ID");

    const video = await Video.findById(videoId);
    if(!video) throw new ApiError(404, "Video not found");

    return res.status(200).json(new ApiResponse(200, "Video retrieved successfully", video));

})

export { publishVideo, getVideoById }