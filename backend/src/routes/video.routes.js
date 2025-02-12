import { Router } from "express";
import { publishVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT); //to apply this middleware to every routes

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

export default router