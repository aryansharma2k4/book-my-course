import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError} from '../utils/apiError.js';
import { Livestream } from '../models/livestream.model.js';
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from 'mongoose';
import { Educator } from '../models/educator.model.js';


const getAllLiveStreams = asyncHandler(async(req , res) => {
    const livestreams  = await Livestream.find().lean();
    return res.status(200).json(new ApiResponse(200, "Livestreams fetched", livestreams))
});




const scheduleLivestream = asyncHandler(async(req, res) => {
    const { title, description, price } = req.body;

    if([title, description].some((field) => field.trim === "")) throw new ApiError(409, "Enter all details");
    if(price < 0) throw new ApiError(400, "Price cannot be negative");


    

    const livestream = await Livestream.create({
        title,
        description,
        price,
        // date: new Date(schedule),
        owner: req.user?._id,
        enrolledStudents: []
    })
    const educatorId = req.user?._id;
    const educator = await Educator.findById(educatorId)
    educator.livestreams.push(livestream._id);
    educator.save();
    

    if(!livestream) throw new ApiError(409, "unable to create a live stream")

    return res.status(200).json(new ApiResponse(200, "Livestream scheduled successfully", livestream));




});

const streamDetailsById = asyncHandler(async(req, res) => {
    const { streamId } = req.params;
    
    if(!isValidObjectId(streamId)) throw new ApiError(404, "Livestream not found");

    const livestream = await Livestream.findById(streamId);
    if(!livestream) throw new ApiError(404, "Live not found");
    console.log(livestream);
    

    return res.status(200).json(new ApiResponse(200, "Livestream fetched successfully", livestream));

})

const startStream = asyncHandler(async(req, res) => {
    const { streamId } = req.params;
    if(!isValidObjectId(streamId)) throw new ApiError(404, "Livestream not found");
    const livestream = await Livestream.findById(streamId);
    if(!livestream) throw new ApiError(404, "Live not found");
    const title = livestream.title;

    const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
        }),
      };

      try {
          const response = await fetch("https://livepeer.studio/api/stream", options);
          const data = await response.json();
          const streamKey = data.streamKey;
          livestream.streamKey = streamKey;
          const playbackId = data.playbackId;
          livestream.playbackId = playbackId;
          await livestream.save()
          

          return res.status(200).json(new ApiResponse(200, "Livestream started successfully", data));
          
          
          
        } 
      catch (error) {
          res.status(500).json({ error: error.message });
        }



})




export { scheduleLivestream, streamDetailsById, startStream, getAllLiveStreams }