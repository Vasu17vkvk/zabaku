import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { registerSchema } from "../validation/auth.validation";
import { sendSuccess } from "../responses/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

import { loginSchema } from "../validation/auth.validation";
import { loginUser } from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    return sendSuccess(
        res,
        201,
        "User registered successfully",
        user
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    return sendSuccess(
        res,
        200,
        "Login successful",
        result
    );
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    return sendSuccess(
        res,
        200,
        "Profile fetched successfully",
        req.user
    );
});