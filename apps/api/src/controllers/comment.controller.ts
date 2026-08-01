import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import { sendSuccess } from "../responses/apiResponse";

import { createCommentSchema } from "../validation/comment.validation";

import {
    createComment,
    getTaskComments,
    updateComment,
    deleteComment,
} from "../services/comment.service";

import { updateCommentSchema } from "../validation/comment.validation";


export const create = asyncHandler(
    async (req: Request, res: Response) => {
        const validatedData =
            createCommentSchema.parse(req.body);

        const comment = await createComment(
            req.params.taskId as string,
            req.user!._id.toString(),
            validatedData
        );

        return sendSuccess(
            res,
            201,
            "Comment created successfully",
            comment
        );
    }
);

export const getAll = asyncHandler(
    async (req: Request, res: Response) => {
        const comments = await getTaskComments(
            req.params.taskId as string
        );

        return sendSuccess(
            res,
            200,
            "Comments fetched successfully",
            comments
        );
    }
);

export const update = asyncHandler(
    async (req: Request, res: Response) => {
        const validatedData =
            updateCommentSchema.parse(req.body);

        const comment = await updateComment(
            req.params.commentId as string,
            req.user!._id.toString(),
            validatedData
        );

        return sendSuccess(
            res,
            200,
            "Comment updated successfully",
            comment
        );
    }
);

export const remove = asyncHandler(
    async (req: Request, res: Response) => {
        await deleteComment(
            req.params.commentId as string,
            req.user!._id.toString()
        );

        return sendSuccess(
            res,
            200,
            "Comment deleted successfully"
        );
    }
);