import { AppError } from "../errors/AppError";
import { WorkspaceRole } from "../constants/workspace.constants";

export function requireWorkspaceRole(
    workspace: any,
    userId: string,
    allowedRoles: string[]
) {
    const member = workspace.members.find(
        (member: any) => member.user.toString() === userId
    );

    if (!member) {
        throw new AppError("Access denied", 403);
    }

    if (!allowedRoles.includes(member.role)) {
        throw new AppError("Insufficient permissions", 403);
    }

    return member;
}

