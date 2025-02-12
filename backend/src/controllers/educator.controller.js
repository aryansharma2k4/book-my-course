
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Educator } from "../models/educator.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";



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

const registerEducator = asyncHandler( async(req, res) => {
    const { name, email, password } = req.body;

    if([name, email, password].some((fields) => fields?.trim() === "")) throw new ApiError(400, "Please enter all fields");

    const exsistingEducator = await Educator.findOne({
        $or: [{email}],
    })
    if(exsistingEducator) throw new ApiError(409, "User with this email ID already exsists");

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    const avatar = avatarLocalPath ? uploadOnCloudinary(avatarLocalPath) : null;

    const educator = await Educator.create({
        name, 
        email,
        password,
        avatar: avatar?.url || null
    })

    const { accessToken } = generateAccessAndRefreshToken(educator._id);
    const createdEducator = await Educator.findById(educator._id).select(" --password -refreshToken");
    if(!createdEducator) throw new ApiError(500, "Error creating user")

    return res.status(200).json(
        new ApiResponse(200, {educator: createdEducator, accessToken }, "Educator Registered Successfully")
    )
})



export { registerEducator }