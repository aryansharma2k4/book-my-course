import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({
    title: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
        required: true
    },
    videoFile: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    isPublished: {
        type: Boolean,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)