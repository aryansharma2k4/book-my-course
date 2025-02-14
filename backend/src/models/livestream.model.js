import mongoose, { Schema } from "mongoose";

const livestreamSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Educator",
      required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    playbackId: {
        type: String, 
        unique: false,
        default: null
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "ended"],
      default: "upcoming",
    },

  },
  { timestamps: true }
);

export const Livestream = mongoose.model("Livestream", livestreamSchema);
