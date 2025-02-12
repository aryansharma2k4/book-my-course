import { Router } from "express";
import { addVideoToCourse, initializeCourse } from "../controllers/course.controller.js";

const router = Router();

router.route("/initializeCourse").post(initializeCourse)
router.route("/addVideoToCourse").post(addVideoToCourse)

export default router