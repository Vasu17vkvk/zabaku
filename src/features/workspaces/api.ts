import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Workspace {
  id: string;
  name: string;
  slug?: string;
  industry?: string;
  teamSize?: string;
  logoUrl?: string;
  membersCount?: number;
  [key: string]: unknown;
}

export interface CreateWorkspaceInput {
  name: string;
  slug?: string;
  industry?: string;
  teamSize?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  slug?: string;
  industry?: string;
  teamSize?: string;
}

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

interface ApiListResponse<T> {
  data?: T[] | { workspaces?: T[] };
  workspaces?: T[];
}

interface ApiItemResponse<T> {
  data?: T | { workspace?: T };
  workspace?: T;
}

function extractList<T>(res: ApiListResponse<T>): T[] {
  if (Array.isArray(res)) return res as T[];
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    const nested = (res.data as { workspaces?: T[] }).workspaces;
    if (Array.isArray(nested)) return nested;
  }
  if (Array.isArray(res.workspaces)) return res.workspaces;
  return [];
}

function extractItem<T>(res: ApiItemResponse<T>): T {
  if (res && typeof res === "object" && "id" in res) return res as T;
  if (res.data) {
    const d = res.data as T | { workspace?: T };
    if (d && typeof d === "object" && "id" in d) return d as T;
    const nested = (d as { workspace?: T }).workspace;
    if (nested) return nested;
  }
  if (res.workspace) return res.workspace;
  return res as unknown as T;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Fetch all workspaces for the authenticated user. */
export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await api<ApiListResponse<Workspace>>("/workspaces");
  return extractList(res);
}

/** Fetch a single workspace by ID. */
export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  const res = await api<ApiItemResponse<Workspace>>(
    `/workspaces/${workspaceId}`
  );
  return extractItem(res);
}

/** Create a new workspace. */
export async function createWorkspace(
  input: CreateWorkspaceInput
): Promise<Workspace> {
  const res = await api<ApiItemResponse<Workspace>>("/workspaces", {
    method: "POST",
    body: input,
  });
  return extractItem(res);
}

/** Partially update a workspace. */
export async function updateWorkspace(
  workspaceId: string,
  input: UpdateWorkspaceInput
): Promise<Workspace> {
  const res = await api<ApiItemResponse<Workspace>>(
    `/workspaces/${workspaceId}`,
    { method: "PATCH", body: input }
  );
  return extractItem(res);
}

/** Delete a workspace by ID. */
export async function deleteWorkspace(workspaceId: string): Promise<void> {
  await api<unknown>(`/workspaces/${workspaceId}`, { method: "DELETE" });
}
