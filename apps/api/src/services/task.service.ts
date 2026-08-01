import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { Workspace } from "../models/Workspace";

import { CreateTaskDto } from "../dtos/task/CreateTask.dto";

import { AppError } from "../errors/AppError";

import { WorkspaceRole } from "../constants/workspace.constants";

import { requireWorkspaceRole } from "../utils/workspacePermissions";

import { User } from "../models/User";

import { UpdateTaskDto } from "../dtos/task/UpdateTask.dto";

import { UpdateTaskStatusDto } from "../dtos/task/UpdateTaskStatus.dto";

import { logActivity } from "./activity.service";

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

    await logActivity({
        workspace: workspace._id.toString(),
        project: project._id.toString(),
        task: task._id.toString(),

        user: currentUserId,

        action: "TASK_CREATED",

        entityType: "Task",

        entityId: task._id.toString(),

        metadata: {
            title: task.title,
        },
    });

    return task;
}
export async function getTasks(
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

    requireWorkspaceRole(
        workspace,
        currentUserId,
        [
            WorkspaceRole.OWNER,
            WorkspaceRole.ADMIN,
            WorkspaceRole.MEMBER,
        ]
    );

    return Task.find({
        project: projectId,
    }).sort({
        createdAt: -1,
    });
}

export async function updateTask(
    taskId: string,
    currentUserId: string,
    data: UpdateTaskDto
) {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const workspace = await Workspace.findById(task.workspace);

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

    const previousValues = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee?.toString(),
    };

    if (data.assignee) {
        const user = await User.findById(data.assignee);

        if (!user) {
            throw new AppError("Assignee not found", 404);
        }

        task.assignee = user._id;
    }

    if (data.title !== undefined) {
        task.title = data.title;
    }

    if (data.description !== undefined) {
        task.description = data.description;
    }

    if (data.priority !== undefined) {
        task.priority = data.priority;
    }

    if (data.dueDate !== undefined) {
        task.dueDate = data.dueDate;
    }

    await task.save();

    await logActivity({
        workspace: workspace._id.toString(),
        project: task.project.toString(),
        task: task._id.toString(),

        user: currentUserId,

        action: "TASK_UPDATED",

        entityType: "Task",

        entityId: task._id.toString(),

        metadata: {
            before: previousValues,
            after: {
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
                assignee: task.assignee?.toString(),
            },
        },
    });

    return task;
}

export async function updateTaskStatus(
    taskId: string,
    currentUserId: string,
    data: UpdateTaskStatusDto
) {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const workspace = await Workspace.findById(task.workspace);

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

    const oldStatus = task.status;

    task.status = data.status;

    await task.save();

    await logActivity({
        workspace: workspace._id.toString(),
        project: task.project.toString(),
        task: task._id.toString(),

        user: currentUserId,

        action: "TASK_STATUS_CHANGED",

        entityType: "Task",

        entityId: task._id.toString(),

        metadata: {
            from: oldStatus,
            to: task.status,
        },
    });

    return task;
}

export async function deleteTask(
    taskId: string,
    currentUserId: string
) {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const workspace = await Workspace.findById(task.workspace);

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

    await logActivity({
        workspace: workspace._id.toString(),
        project: task.project.toString(),
        task: task._id.toString(),

        user: currentUserId,

        action: "TASK_DELETED",

        entityType: "Task",

        entityId: task._id.toString(),

        metadata: {
            title: task.title,
        },
    });

    await task.deleteOne();
}
