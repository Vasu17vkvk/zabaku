import { Workspace } from "../models/Workspace";
import { CreateWorkspaceDto } from "../dtos/workspace/CreateWorkspace.dto";
import { AuthenticatedUser } from "../types/auth.types";
import { Types } from "mongoose";

import { AppError } from "../errors/AppError";

import { WorkspaceRole } from "../constants/workspace.constants";

import { UpdateWorkspaceDto } from "../dtos/workspace/UpdateWorkspace.dto";
import { requireWorkspaceRole } from "../utils/workspacePermissions";


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

export async function getWorkspaceById(
    workspaceId: string,
    userId: Types.ObjectId
) {
    const workspace = await Workspace.findOne({
        _id: workspaceId,
        "members.user": userId,
    });

    if (!workspace) {
        throw new AppError(
            "Workspace not found or access denied",
            404
        );
    }

    return workspace;
}

export async function updateWorkspace(
    workspaceId: string,
    userId: string,
    data: UpdateWorkspaceDto
) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    requireWorkspaceRole(
        workspace,
        userId,
        [
            WorkspaceRole.OWNER,
            WorkspaceRole.ADMIN,
        ]
    );

    if (data.name !== undefined) {
        workspace.name = data.name;
    }

    if (data.description !== undefined) {
        workspace.description = data.description;
    }

    await workspace.save();

    return workspace;
}