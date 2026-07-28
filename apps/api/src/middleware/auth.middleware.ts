import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { User } from "../models/User";
import { JwtUserPayload } from "../types/jwt.types";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify the JWT
        const decoded = jwt.verify(
            token,
            env.JWT_SECRET
        ) as JwtUserPayload;

        // Find the authenticated user
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new AppError("User no longer exists", 401);
        }

        // Attach the user to the request
        req.user = user;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Invalid or expired token", 401);
    }
};