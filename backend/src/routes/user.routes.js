import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPlaybackId, loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route('/registerUser').post(registerUser)
router.route('/loginUser').post(loginUser)
router.route('/getLive/:streamId').get(getPlaybackId)

export default router