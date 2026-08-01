import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema(
    {
        task: {
            type: Types.ObjectId,
            ref: "Task",
            required: true,
        },

        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Comment = model("Comment", commentSchema);