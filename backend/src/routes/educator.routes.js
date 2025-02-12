import { Router } from "express";
import { registerEducator } from "../controllers/educator.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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


export default router