import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import { sendSuccess } from "../responses/apiResponse";

import { createProjectSchema } from "../validation/project.validation";

import { createProject, getProjects, getProjectById } from "../services/project.service";

export const create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createProjectSchema.parse(req.body);

    const project = await createProject(
        req.params.workspaceId as string,
        req.user!._id.toString(),
        validatedData
    );

    return sendSuccess(
        res,
        201,
        "Project created successfully",
        project
    );
});

export const getAll = asyncHandler(async (req, res) => {
    const projects = await getProjects(
        req.params.workspaceId as string,
        req.user!._id.toString()
    );

    return sendSuccess(
        res,
        200,
        "Projects fetched successfully",
        projects
    );
});

export const getById = asyncHandler(async (req, res) => {
    const project = await getProjectById(
        req.params.projectId as string,
        req.user!._id.toString()
    );

    return sendSuccess(
        res,
        200,
        "Project fetched successfully",
        project
    );
});