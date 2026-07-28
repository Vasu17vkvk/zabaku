import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { Workspace } from "../models/Workspace";

import { CreateTaskDto } from "../dtos/task/CreateTask.dto";

import { AppError } from "../errors/AppError";

import { WorkspaceRole } from "../constants/workspace.constants";

import { requireWorkspaceRole } from "../utils/workspacePermissions";

import { User } from "../models/User";

export async function createTask(
    projectId: string,
    currentUserId: string,
    data: CreateTaskDto
) {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const workspace = await Workspace.findById(project.workspace);

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

    let assignee = null;

    if (data.assignee) {
        const user = await User.findById(data.assignee);

        if (!user) {
            throw new AppError("Assignee not found", 404);
        }

        assignee = user._id;
    }

    const task = await Task.create({
        title: data.title,
        description: data.description,

        project: project._id,

        workspace: workspace._id,

        assignee,

        createdBy: currentUserId,

        priority: data.priority,

        dueDate: data.dueDate,
    });

    return task;
}