import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Livestream } from "../models/livestream.model.js"
import { Course } from "../models/course.model.js"
import { isValidObjectId } from "mongoose"

const generateAccessAndRefreshToken = async(userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    }
    catch(err){
        throw new ApiError(500, "Something went wrong generating access and refresh token")
    }
}


const registerCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const userId = req.user?._id;

    if (!isValidObjectId(courseId)) 
        throw new ApiError(409, "Invalid course ID provided");

    
    if (!isValidObjectId(userId)) 
        throw new ApiError(409, "Invalid user ID provided");

    const course = await Course.findById(courseId); 

    if (!course) 
        throw new ApiError(404, "Unable to find the course you mentioned");
    const user = await User.findById(userId);
    console.log(user.courses)


    if (course.enrolledUsers.includes(userId)) 
        throw new ApiError(400, "User is already enrolled in this course");

    course.enrolledUsers.push(userId);
    await course.save(); 

    
    user.courses.push(courseId);
    await user.save();

    return res.status(200).json(new ApiResponse(200, "Course registered successfully", course.enrolledUsers));
});

const registerLivestream = asyncHandler(async (req, res) => {
    const { livestreamId } = req.params;

    if (!isValidObjectId(livestreamId)) 
        throw new ApiError(409, "Invalid livestream ID provided");

    const userId = req.user?._id;

    if (!isValidObjectId(userId)) 
        throw new ApiError(409, "Invalid user ID provided");

    const livestream = await Livestream.findById(livestreamId);

    if (!livestream) 
        throw new ApiError(404, "Unable to find the livestream you mentioned");

    // ✅ Ensure the user is not already enrolled to prevent duplicates
    if (livestream.enrolledStudents.includes(userId)) 
        throw new ApiError(400, "User is already registered for this livestream");

    livestream.enrolledStudents.push(userId); // ✅ Add the user
    await livestream.save(); // ✅ Save changes

    return res.status(200).json(new ApiResponse(200, "Livestream registered successfully", livestream.enrolledStudents));
});

const ifRegisteredCourse = asyncHandler(async(req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    const enrolledStudents = course.enrolledUsers.find().lean();
    console.log(enrolledStudents);
    
})


const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body;
    if([name, email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({
        $or: [{ email }]
    })
    if(existingUser) throw new ApiError(409, "user already exists");
    const user = await User.create({
        name,
        email, 
        password,
        course: []
    })
    const {accessToken} = await generateAccessAndRefreshToken(user._id);
    console.log(accessToken);
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser) throw new ApiError(500, "Error creating user");

    return res.status(201).json(new ApiResponse(200, {user: createdUser, accessToken}, "User created Successfully"))
})
const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    if(!email && !password) throw new ApiError(400, "Username and password are required");
    const user = await User.findOne({
        $or: [{email}]
    })
    if(!user) throw new ApiError(404, "User Not Found");
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) throw new ApiError(401, "Password is wrong");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
    ))
})

const getPlaybackId = asyncHandler(async(req, res) => {
    const { streamId } = req.params;
    console.log(streamId);
    
    const livestream = await Livestream.findById(streamId);
    if(!livestream) throw new ApiError(404, "Livestream not found");
    const playbackId = livestream.playbackId;
    if(!playbackId) throw new ApiError(404, "Playback id not found");
    return res.status(200).json(new ApiResponse(200, "Playback id fetched successfully", playbackId))
})

const getUserDetails = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    if(!isValidObjectId(userId)) throw new ApiError(409, "Invalid user ID provided");
    const user = await User.findById(userId);
    if(!user) throw new ApiError(404, "User not found");
    return res.status(200).json(new ApiResponse(200, "User details fetched successfully", user))
})



export { registerUser, loginUser, getPlaybackId, registerLivestream, registerCourse, ifRegisteredCourse, getUserDetails }