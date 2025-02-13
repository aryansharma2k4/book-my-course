import { Router } from "express";
import { publishVideo, getVideoById } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/publishVideo").post(
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },{
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVideo
)   
router.route("/:videoId").get(getVideoById)

export default router