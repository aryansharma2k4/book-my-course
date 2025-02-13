import { Router } from "express";
import { addVideoToCourse, initializeCourse, getCourseById } from "../controllers/course.controller.js";

const router = Router();

router.route("/initializeCourse").post(initializeCourse)
router.route("/addVideoToCourse").post(addVideoToCourse)
router.route("/:courseId").get(getCourseById)

export default router