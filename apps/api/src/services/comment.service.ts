import { Comment } from "../models/Comment";
import { Task } from "../models/Task";
import { Workspace } from "../models/Workspace";

import { CreateCommentDto } from "../dtos/comment/CreateComment.dto";
import { UpdateCommentDto } from "../dtos/comment/UpdateComment.dto";

import { AppError } from "../errors/AppError";

import { requireWorkspaceRole } from "../utils/workspacePermissions";
import { WorkspaceRole } from "../constants/workspace.constants";



export async function createComment(
    taskId: string,
    currentUserId: string,
    data: CreateCommentDto
) {
    // Find task
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    // Find workspace
    const workspace = await Workspace.findById(task.workspace);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    // Check permissions
    requireWorkspaceRole(
        workspace,
        currentUserId,
        [
            WorkspaceRole.OWNER,
            WorkspaceRole.ADMIN,
            WorkspaceRole.MEMBER,
        ]
    );

    // Create comment
    const comment = await Comment.create({
        task: task._id,
        user: currentUserId,
        message: data.message,
    });

    return comment;
}

export async function getTaskComments(taskId: string) {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return Comment.find({
        task: taskId,
    })
        .populate("user", "firstName lastName avatar")
        .sort({
            createdAt: 1,
        });
}

export async function updateComment(
    commentId: string,
    currentUserId: string,
    data: UpdateCommentDto
) {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    if (comment.user.toString() !== currentUserId) {
        throw new AppError(
            "You can only edit your own comments",
            403
        );
    }

    comment.message = data.message;

    await comment.save();

    return comment;
}

export async function deleteComment(
    commentId: string,
    currentUserId: string
) {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    const task = await Task.findById(comment.task);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const workspace = await Workspace.findById(task.workspace);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const member = workspace.members.find(
        (m) => m.user.toString() === currentUserId
    );

    if (!member) {
        throw new AppError("Access denied", 403);
    }

    const isAuthor =
        comment.user.toString() === currentUserId;

    const isAdmin =
        member.role === WorkspaceRole.ADMIN ||
        member.role === WorkspaceRole.OWNER;

    if (!isAuthor && !isAdmin) {
        throw new AppError(
            "You don't have permission to delete this comment",
            403
        );
    }

    await comment.deleteOne();
}