import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }]  
})

export const Course = mongoose.model("Course", courseSchema)