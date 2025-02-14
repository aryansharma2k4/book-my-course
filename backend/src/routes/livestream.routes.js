import { scheduleLivestream, streamDetailsById, startStream, getAllLiveStreams } from "../controllers/livestream.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route("/schedule").post(scheduleLivestream);
router.route("/stream/:streamId").get(streamDetailsById);
router.route("/live/:streamId").get(startStream);
router.route("/all").get(getAllLiveStreams);

export default router;
