import { Schema, model, Types } from "mongoose";

const memberSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: ["Owner", "Admin", "Member"],
            default: "Member",
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const workspaceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: {
            type: [memberSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const Workspace = model("Workspace", workspaceSchema);