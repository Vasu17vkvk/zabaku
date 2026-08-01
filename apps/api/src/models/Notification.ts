import { Schema, model, Types } from "mongoose";

const notificationSchema = new Schema(
    {
        recipient: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        sender: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        workspace: {
            type: Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        type: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        entityType: {
            type: String,
            enum: ["Workspace", "Project", "Task", "Comment"],
            required: true,
        },

        entityId: {
            type: Types.ObjectId,
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification = model(
    "Notification",
    notificationSchema
);