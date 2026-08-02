import { Workspace } from "../models/Workspace";
import { CreateWorkspaceDto } from "../dtos/workspace/CreateWorkspace.dto";
import { AuthenticatedUser } from "../types/auth.types";
import { Types } from "mongoose";

import { AppError } from "../errors/AppError";

import {
    WorkspaceRole,
    WorkspaceRoleType,
} from "../constants/workspace.constants";

import { UpdateWorkspaceDto } from "../dtos/workspace/UpdateWorkspace.dto";
import { requireWorkspaceRole } from "../utils/workspacePermissions";

import { User } from "../models/User";
import { AddMemberDto } from "../dtos/workspace/AddMember.dto";


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

export async function getWorkspaceMembers(
    workspaceId: string,
    userId: string
) {
    const workspace = await Workspace.findById(workspaceId)
        .populate({
            path: "members.user",
            select: "name email avatarUrl",
        });

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    requireWorkspaceRole(workspace, userId, [
        WorkspaceRole.OWNER,
        WorkspaceRole.ADMIN,
        WorkspaceRole.MEMBER,
    ]);

    return workspace.members;
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

export async function addMemberToWorkspace(
    workspaceId: string,
    currentUserId: string,
    data: AddMemberDto
) {
    // Find the workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    // Only Owner or Admin can add members
    requireWorkspaceRole(workspace, currentUserId, [
        WorkspaceRole.OWNER,
        WorkspaceRole.ADMIN,
    ]);

    // Find the user by email
    const user = await User.findOne({
        email: data.email,
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Check if the user is already a member
    const alreadyMember = workspace.members.some(
        (member: any) =>
            member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
        throw new AppError(
            "User is already a member of this workspace",
            409
        );
    }

    // Add the member
    workspace.members.push({
        user: user._id,
        role: data.role,
        joinedAt: new Date(),
    });

    await workspace.save();

    return workspace;
}

export async function updateWorkspaceMemberRole(
    workspaceId: string,
    currentUserId: string,
    memberId: string,
    role: WorkspaceRoleType
) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    requireWorkspaceRole(workspace, currentUserId, [
        WorkspaceRole.OWNER,
        WorkspaceRole.ADMIN,
    ]);

    const member = workspace.members.find(
        (m: any) => m.user.toString() === memberId
    );

    if (!member) {
        throw new AppError("Member not found", 404);
    }

    member.role = role;

    await workspace.save();

    return member;
}

export async function removeMemberFromWorkspace(
    workspaceId: string,
    currentUserId: string,
    memberId: string
) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    requireWorkspaceRole(workspace, currentUserId, [
        WorkspaceRole.OWNER,
        WorkspaceRole.ADMIN,
    ]);

    const member = workspace.members.find(
        (m: any) => m.user.toString() === memberId
    );

    if (!member) {
        throw new AppError("Member not found", 404);
    }

    if (member.role === WorkspaceRole.OWNER) {
        throw new AppError("Owner cannot be removed", 403);
    }

    const memberIndex = workspace.members.findIndex(
        (m: any) => m.user.toString() === memberId
    );

    if (memberIndex === -1) {
        throw new AppError("Member not found", 404);
    }

    workspace.members.splice(memberIndex, 1);

    await workspace.save();

    return workspace;
}