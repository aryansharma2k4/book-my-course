
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Educator } from "../models/educator.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Livestream } from "../models/livestream.model.js";



const generateAccessAndRefreshToken = async(userId) =>{
    try{
        const educator = await Educator.findById(userId)
        const accessToken = educator.generateAccessToken()
        const refreshToken = educator.generateRefreshToken()

        educator.refreshToken = refreshToken;
        await educator.save({validationBeforeSave: false})

        return {accessToken, refreshToken}

    }
    catch(err){
        throw new ApiError(500, "Something went wrong generating access and refresh token")
    }
}

const getEducatorDetails = asyncHandler( async(req, res) => {
    const educatorId = req.user._id;
    if(!isValidObjectId(educatorId)) throw new ApiError(404, "Unable to find the educator");

    const educator = await Educator.findById(educatorId)
    if(!educator) throw new ApiError(404, "unable to find the educator");
    return res.status(200).json(new ApiResponse(200, "educator fetched successfully", educator))

})

const getEducatorLivestreams = asyncHandler( async(req, res) => {
    const educatorId = req.user._id;
    if(!isValidObjectId(educatorId)) throw new ApiError(404, "Unable to find the educator");

    const educator = await Educator.findById(educatorId)
    if(!educator) throw new ApiError(404, "unable to find the educator");

    const livestreams = educator.livestreams;
    
    return res.status(200).json(new ApiResponse(200, "livestreams fetched successfully", livestreams))
})

const registerEducator = asyncHandler( async(req, res) => {
    const { name, email, password } = req.body;

    

    if([name, email, password].some((fields) => fields?.trim() === "")) throw new ApiError(400, "Please enter all fields");

    const exsistingEducator = await Educator.findOne({
        $or: [{email}],
    })
    if(exsistingEducator) throw new ApiError(409, "User with this email ID already exsists");

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    console.log(avatarLocalPath);
    

    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;

    const educator = await Educator.create({
        name, 
        email,
        password,
        avatar: avatar?.url || null
    })

    const { accessToken } = await generateAccessAndRefreshToken(educator._id);
    const createdEducator = await Educator.findById(educator._id).select(" --password -refreshToken");
    if(!createdEducator) throw new ApiError(500, "Error creating user")

    return res.status(200).json(
        new ApiResponse(200, {educator: createdEducator, accessToken }, "Educator Registered Successfully")
    )
})
const loginEducator = asyncHandler( async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password) throw new ApiError(409, "These fields are required")
    const educator = await Educator.findOne({
        $or: [{email}]    
    })
    if(!educator) throw new ApiError(404, "User not found");
    const isPasswordValid = await educator.isPasswordCorrect(password);
    if(!isPasswordValid) throw new ApiError(403, "Password is Wrong");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(educator._id);
    const loggedInEducator = await Educator.findById(educator._id).select("-password -refreshToken")

    const options = {
        httpOnly: false,
        secure: true
    }
    return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
        educator: loggedInEducator,
        accessToken,
        refreshToken,
        
    },
"educator logged in successfully"))
})

const getStreamKey = asyncHandler(async(req, res) => {
    const { streamId } = req.params;
    const livestream = await Livestream.findById(streamId);
    if(!livestream) throw new ApiError(404, "Livestream not found");
    const streamKey = livestream.streamKey;
    if(!streamKey) throw new ApiError(404, "Stream key not found");
    return res.status(200).json(new ApiResponse(200, "Stream key fetched successfully", streamKey))
})



export { registerEducator, loginEducator, getStreamKey, getEducatorLivestreams, getEducatorDetails }