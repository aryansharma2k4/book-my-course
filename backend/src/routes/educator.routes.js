import { Router } from "express";
import { registerEducator, loginEducator, getStreamKey, getEducatorLivestreams } from "../controllers/educator.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/registerEducator").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        }
    ]),
    registerEducator
)
router.route("/logInEducator").post(loginEducator)
router.use(verifyJWT).route('/getStreamKey/:streamId').get(getStreamKey)
router.use(verifyJWT).route('/getLS').get(getEducatorLivestreams)

export default router