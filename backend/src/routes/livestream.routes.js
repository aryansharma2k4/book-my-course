import { scheduleLivestream, streamDetailsById, startStream, getAllLiveStreams } from "../controllers/livestream.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/all").get(getAllLiveStreams);
router.route("/stream/:streamId").get(streamDetailsById);
router.use(verifyJWT).route("/schedule").post(scheduleLivestream);
router.use(verifyJWT).route("/live/:streamId").get(startStream);

export default router;
