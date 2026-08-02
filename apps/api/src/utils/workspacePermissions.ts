import { AppError } from "../errors/AppError";

export function requireWorkspaceRole(
    workspace: any,
    userId: string,
    allowedRoles: string[]
) {
    const member = workspace.members.find((member: any) => {
        const id =
            typeof member.user === "object"
                ? member.user._id?.toString()
                : member.user.toString();

        return id === userId;
    });

    if (!member) {
        throw new AppError("Access denied", 403);
    }

    if (!allowedRoles.includes(member.role)) {
        throw new AppError("Insufficient permissions", 403);
    }

    return member;
}