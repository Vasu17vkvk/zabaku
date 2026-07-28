import { Project } from "../models/Project";
import { Workspace } from "../models/Workspace";

import { CreateProjectDto } from "../dtos/project/CreateProject.dto";

import { AppError } from "../errors/AppError";

import { WorkspaceRole } from "../constants/workspace.constants";

import { requireWorkspaceRole } from "../utils/workspacePermissions";

export async function createProject(
    workspaceId: string,
    currentUserId: string,
    data: CreateProjectDto
) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    requireWorkspaceRole(
        workspace,
        currentUserId,
        [
            WorkspaceRole.OWNER,
            WorkspaceRole.ADMIN,
        ]
    );

    const project = await Project.create({
        name: data.name,
        description: data.description,
        workspace: workspace._id,
        createdBy: currentUserId,
    });

    return project;
}

export async function getProjects(
    workspaceId: string,
    currentUserId: string
) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    requireWorkspaceRole(
        workspace,
        currentUserId,
        [
            WorkspaceRole.OWNER,
            WorkspaceRole.ADMIN,
            WorkspaceRole.MEMBER,
        ]
    );

    return Project.find({
        workspace: workspaceId,
    }).sort({
        createdAt: -1,
    });
}

export async function getProjectById(
    projectId: string,
    currentUserId: string
) {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const workspace = await Workspace.findById(project.workspace);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    requireWorkspaceRole(workspace, currentUserId, [
        WorkspaceRole.OWNER,
        WorkspaceRole.ADMIN,
        WorkspaceRole.MEMBER,
    ]);

    return project;
}