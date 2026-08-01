import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types — Backend shapes
// ---------------------------------------------------------------------------

export type ApiPriority = "Urgent" | "High" | "Medium" | "Low";
export type ApiStatus =
  | "On track"
  | "At risk"
  | "Blocked"
  | "In review"
  | "Shipped";

export interface ApiMember {
  _id?: string;
  id?: string;
  name?: string;
  initials?: string;
  color?: string;
  avatarUrl?: string;
}

export interface ApiProject {
  _id: string;
  id?: string;
  key?: string;
  name: string;
  description?: string;
  color?: string;
  progress?: number;
  status?: ApiStatus;
  priority?: ApiPriority;
  dueDate?: string;
  members?: ApiMember[];
  tasksTotal?: number;
  tasksDone?: number;
  commentsCount?: number;
  attachmentsCount?: number;
  updatedAt?: string;
  createdAt?: string;
  starred?: boolean;
  aiAssisted?: boolean;
  workspaceId?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  status?: ApiStatus;
  priority?: ApiPriority;
  dueDate?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
  status?: ApiStatus;
  priority?: ApiPriority;
  dueDate?: string;
  progress?: number;
  starred?: boolean;
}

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

interface ListEnvelope {
  data?: ApiProject[] | { projects?: ApiProject[] };
  projects?: ApiProject[];
}

interface ItemEnvelope {
  data?: ApiProject | { project?: ApiProject };
  project?: ApiProject;
}

function extractList(res: ListEnvelope | ApiProject[]): ApiProject[] {
  if (Array.isArray(res)) return res;
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    const nested = (res.data as { projects?: ApiProject[] }).projects;
    if (Array.isArray(nested)) return nested;
  }
  if (Array.isArray((res as ListEnvelope).projects)) {
    return (res as ListEnvelope).projects!;
  }
  return [];
}

function extractItem(res: ItemEnvelope | ApiProject): ApiProject {
  // Bare object with _id / id is already the project
  if (res && typeof res === "object" && ("_id" in res || "id" in res)) {
    return res as ApiProject;
  }
  const env = res as ItemEnvelope;
  if (env.data) {
    const d = env.data;
    if ("_id" in d || "id" in d) return d as ApiProject;
    const nested = (d as { project?: ApiProject }).project;
    if (nested) return nested;
  }
  if (env.project) return env.project;
  return res as ApiProject;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Fetch all projects for a given workspace. */
export async function getProjects(workspaceId: string): Promise<ApiProject[]> {
  const res = await api<ListEnvelope | ApiProject[]>(
    `/workspaces/${workspaceId}/projects`
  );
  return extractList(res);
}

/** Fetch a single project by ID. */
export async function getProject(projectId: string): Promise<ApiProject> {
  const res = await api<ItemEnvelope | ApiProject>(`/projects/${projectId}`);
  return extractItem(res);
}

/** Create a project inside a workspace. */
export async function createProject(
  workspaceId: string,
  input: CreateProjectInput
): Promise<ApiProject> {
  const res = await api<ItemEnvelope | ApiProject>(
    `/workspaces/${workspaceId}/projects`,
    { method: "POST", body: input }
  );
  return extractItem(res);
}

/** Partially update a project. */
export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<ApiProject> {
  const res = await api<ItemEnvelope | ApiProject>(`/projects/${projectId}`, {
    method: "PATCH",
    body: input,
  });
  return extractItem(res);
}

/** Delete a project. */
export async function deleteProject(projectId: string): Promise<void> {
  await api<unknown>(`/projects/${projectId}`, { method: "DELETE" });
}
