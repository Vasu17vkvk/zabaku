import { Response } from "express";

export function sendSuccess(
    res: Response,
    statusCode: number,
    message: string,
    data?: unknown
) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

export function sendError(
    res: Response,
    statusCode: number,
    message: string
) {
    return res.status(statusCode).json({
        success: false,
        message,
    });
}