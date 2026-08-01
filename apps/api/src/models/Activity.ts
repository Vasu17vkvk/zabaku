import { Schema, model, Types } from "mongoose";

const activitySchema = new Schema(
    {
        workspace: {
            type: Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        project: {
            type: Types.ObjectId,
            ref: "Project",
        },

        task: {
            type: Types.ObjectId,
            ref: "Task",
        },

        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            required: true,
        },

        entityType: {
            type: String,
            enum: [
                "Workspace",
                "Project",
                "Task",
                "Comment",
            ],
            required: true,
        },

        entityId: {
            type: Types.ObjectId,
            required: true,
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

export const Activity = model(
    "Activity",
    activitySchema
);