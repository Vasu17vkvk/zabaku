import { Workspace } from "../models/Workspace";
import { CreateWorkspaceDto } from "../dtos/workspace/CreateWorkspace.dto";
import { AuthenticatedUser } from "../types/auth.types";
import { Types } from "mongoose";


export async function createWorkspace(
    data: CreateWorkspaceDto,
    user: AuthenticatedUser
) {
    const workspace = await Workspace.create({
        name: data.name,
        description: data.description,

        owner: user._id,

        members: [
            {
                user: user._id,
                role: "Owner",
            },
        ],
    });

    return workspace;
}

export async function getUserWorkspaces(userId: Types.ObjectId) {
    return Workspace.find({
        "members.user": userId,
    }).sort({
        createdAt: -1,
    });
}