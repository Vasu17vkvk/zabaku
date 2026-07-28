export const WorkspaceRole = {
    OWNER: "Owner",
    ADMIN: "Admin",
    MEMBER: "Member",
} as const;

export type WorkspaceRoleType =
    (typeof WorkspaceRole)[keyof typeof WorkspaceRole];