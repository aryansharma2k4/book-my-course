import { scheduleLivestream, streamDetailsById, startStream, getAllLiveStreams } from "../controllers/livestream.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



router.use(verifyJWT).route("/schedule").post(scheduleLivestream);
router.use(verifyJWT).route("/stream/:streamId").get(streamDetailsById);
router.use(verifyJWT).route("/live/:streamId").get(startStream);
router.route("/all").get(getAllLiveStreams);

export default router;
