import { WorkspaceRoleType } from "../../constants/workspace.constants";

export interface AddMemberDto {
    email: string;
    role: WorkspaceRoleType;
}