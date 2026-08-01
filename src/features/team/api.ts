import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TeamRole = "Owner" | "Admin" | "Member" | "Guest" | string;
export type TeamStatus = "online" | "away" | "offline" | string;

export interface ApiTeamMemberUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  handle?: string;
  avatarUrl?: string;
  title?: string;
  team?: string;
  hue?: number;
}

export interface ApiTeamMember {
  _id: string;
  id?: string;
  userId?: string | ApiTeamMemberUser;
  user?: ApiTeamMemberUser;
  name?: string;
  handle?: string;
  email?: string;
  role?: TeamRole;
  team?: string;
  title?: string;
  status?: TeamStatus;
  hue?: number;
  projects?: number;
  tasks?: number;
  joined?: string;
  lastActive?: string;
  createdAt?: string;
}

export interface InviteMemberInput {
  email: string;
  role?: TeamRole;
  emails?: string[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

type ListEnvelope = {
  data?: ApiTeamMember[] | { members?: ApiTeamMember[]; team?: ApiTeamMember[] };
  members?: ApiTeamMember[];
  team?: ApiTeamMember[];
  items?: ApiTeamMember[];
};

type ItemEnvelope = {
  data?: ApiTeamMember | { member?: ApiTeamMember };
  member?: ApiTeamMember;
};

function extractList(res: ListEnvelope | ApiTeamMember[]): ApiTeamMember[] {
  if (Array.isArray(res)) return res;
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    const nested = res.data as { members?: ApiTeamMember[]; team?: ApiTeamMember[] };
    if (Array.isArray(nested.members)) return nested.members;
    if (Array.isArray(nested.team)) return nested.team;
  }
  if (Array.isArray((res as ListEnvelope).members)) return (res as ListEnvelope).members!;
  if (Array.isArray((res as ListEnvelope).team)) return (res as ListEnvelope).team!;
  if (Array.isArray((res as ListEnvelope).items)) return (res as ListEnvelope).items!;
  return [];
}

function extractItem(res: ItemEnvelope | ApiTeamMember): ApiTeamMember {
  if (res && typeof res === "object" && ("_id" in res || "id" in res)) {
    return res as ApiTeamMember;
  }
  const env = res as ItemEnvelope;
  if (env.data) {
    const d = env.data as ApiTeamMember | { member?: ApiTeamMember };
    if ("_id" in d || "id" in d) return d as ApiTeamMember;
    const nested = (d as { member?: ApiTeamMember }).member;
    if (nested) return nested;
  }
  if (env.member) return env.member;
  return res as ApiTeamMember;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Fetch workspace members list. */
export async function getMembers(workspaceId: string): Promise<ApiTeamMember[]> {
  try {
    const res = await api<ListEnvelope | ApiTeamMember[]>(
      `/workspaces/${workspaceId}/members`
    );
    return extractList(res);
  } catch {
    const res = await api<ListEnvelope | ApiTeamMember[]>(`/members`);
    return extractList(res);
  }
}

/** Invite a new member to the workspace. */
export async function inviteMember(
  workspaceId: string,
  input: InviteMemberInput | string
): Promise<ApiTeamMember> {
  const body = typeof input === "string" ? { email: input } : input;
  try {
    const res = await api<ItemEnvelope | ApiTeamMember>(
      `/workspaces/${workspaceId}/members`,
      { method: "POST", body }
    );
    return extractItem(res);
  } catch {
    const res = await api<ItemEnvelope | ApiTeamMember>(`/members/invite`, {
      method: "POST",
      body,
    });
    return extractItem(res);
  }
}

/** Update member role. */
export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  role: TeamRole
): Promise<ApiTeamMember> {
  try {
    const res = await api<ItemEnvelope | ApiTeamMember>(
      `/workspaces/${workspaceId}/members/${memberId}`,
      { method: "PATCH", body: { role } }
    );
    return extractItem(res);
  } catch {
    const res = await api<ItemEnvelope | ApiTeamMember>(`/members/${memberId}`, {
      method: "PATCH",
      body: { role },
    });
    return extractItem(res);
  }
}

/** Remove a member from the workspace. */
export async function removeMember(
  workspaceId: string,
  memberId: string
): Promise<void> {
  try {
    await api<unknown>(`/workspaces/${workspaceId}/members/${memberId}`, {
      method: "DELETE",
    });
  } catch {
    await api<unknown>(`/members/${memberId}`, { method: "DELETE" });
  }
}
