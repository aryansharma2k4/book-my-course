import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async(userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validationBeforeSave: false})

        return {accessToken, refreshToken}

    }
    catch(err){
        throw new ApiError(500, "Something went wrong generating access and refresh token")
    }
}
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
    const accessToken = await generateAccessAndRefreshToken(user._id);
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

export { registerUser, loginUser }