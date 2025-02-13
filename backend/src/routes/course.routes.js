import { Router } from "express";
import { addVideoToCourse, initializeCourse, getCourseById } from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route("/initializeCourse").post(initializeCourse)
router.route("/addVideoToCourse").post(addVideoToCourse)
router.route("/:courseId").get(getCourseById)

export default router