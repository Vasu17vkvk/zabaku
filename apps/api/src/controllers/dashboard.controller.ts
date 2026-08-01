import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import { sendSuccess } from "../responses/apiResponse";

import { getDashboardData } from "../services/dashboard.service";

export const getDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const dashboard = await getDashboardData(
            req.user!._id.toString()
        );

        return sendSuccess(
            res,
            200,
            "Dashboard fetched successfully",
            dashboard
        );
    }
);