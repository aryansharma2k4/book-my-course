import { Router } from "express";
import { addVideoToCourse, initializeCourse, getCourseById, getAllCourses } from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/all").get(getAllCourses)
router.route("/:courseId").get(getCourseById)

router.use(verifyJWT).route("/initializeCourse").post(initializeCourse)
router.use(verifyJWT).route("/addVideoToCourse").post(addVideoToCourse)


export default router