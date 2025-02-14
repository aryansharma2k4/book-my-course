import { Router } from "express";
import { verifyJWT } from "../middlewares/authUser.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPlaybackId, ifRegisteredCourse, loginUser, registerCourse, registerLivestream, registerUser, getUserDetails } from "../controllers/user.controller.js";

const router = Router();




router.route('/registerUser').post(registerUser)
router.route('/loginUser').post(loginUser)
router.route('/getLive/:streamId').get(getPlaybackId)

router.use(verifyJWT).route('/registerCourse/:courseId').post(registerCourse);
router.use(verifyJWT).route('/registerLivestream/:streamId').post(registerLivestream)
router.use(verifyJWT).route('/ifReg/:courseId').post(ifRegisteredCourse)
router.use(verifyJWT).route('/getDetails').get(getUserDetails)

export default router