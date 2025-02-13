import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import educatorRouter from "./routes/educator.routes.js"
import videoRouter from "./routes/video.routes.js"
import courseRouter from "./routes/course.routes.js"
import liveStreamRouter from "./routes/livestream.js"


app.use("/api/v1/users",userRouter)
app.use("/api/v1/educator", educatorRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/livestream", liveStreamRouter)

export { app }