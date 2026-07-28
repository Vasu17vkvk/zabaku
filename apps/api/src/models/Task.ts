import { Schema, model, Types } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        project: {
            type: Types.ObjectId,
            ref: "Project",
            required: true,
        },

        workspace: {
            type: Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        assignee: {
            type: Types.ObjectId,
            ref: "User",
            default: null,
        },

        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Todo",
                "In Progress",
                "Review",
                "Done",
            ],
            default: "Todo",
        },

        priority: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Urgent",
            ],
            default: "Medium",
        },

        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Task = model("Task", taskSchema);