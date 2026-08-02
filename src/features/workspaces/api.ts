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

// ---------------------------------------------------------------------------
// Normalize MongoDB _id -> id
// ---------------------------------------------------------------------------

function normalizeWorkspace(data: any): Workspace {
  return {
    ...data,
    id: data.id ?? data._id,
  };
}

function extractList<T>(res: ApiListResponse<any>): T[] {
  let list: any[] = [];

  if (Array.isArray(res)) {
    list = res;
  } else if (res.data) {
    if (Array.isArray(res.data)) {
      list = res.data;
    } else if (Array.isArray((res.data as any).workspaces)) {
      list = (res.data as any).workspaces!;
    }
  } else if (Array.isArray(res.workspaces)) {
    list = res.workspaces;
  }

  return list.map(normalizeWorkspace) as T[];
}

function extractItem<T>(res: ApiItemResponse<any>): T {
  let item: any = null;

  if (res.data) {
    if ((res.data as any).workspace) {
      item = (res.data as any).workspace;
    } else {
      item = res.data;
    }
  } else if (res.workspace) {
    item = res.workspace;
  } else {
    item = res;
  }

  return normalizeWorkspace(item) as T;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Fetch all workspaces for the authenticated user. */
export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await api<ApiListResponse<Workspace>>("/workspaces");

  const workspaces = extractList<Workspace>(res);

  console.log("WORKSPACES:", workspaces);

  return workspaces;
}

/** Fetch a single workspace by ID. */
export async function getWorkspace(
  workspaceId: string
): Promise<Workspace> {
  const res = await api<ApiItemResponse<Workspace>>(
    `/workspaces/${workspaceId}`
  );

  return extractItem<Workspace>(res);
}

/** Create a new workspace. */
export async function createWorkspace(
  input: CreateWorkspaceInput
): Promise<Workspace> {
  const res = await api<ApiItemResponse<Workspace>>("/workspaces", {
    method: "POST",
    body: input,
  });

  return extractItem<Workspace>(res);
}

/** Partially update a workspace. */
export async function updateWorkspace(
  workspaceId: string,
  input: UpdateWorkspaceInput
): Promise<Workspace> {
  const res = await api<ApiItemResponse<Workspace>>(
    `/workspaces/${workspaceId}`,
    {
      method: "PATCH",
      body: input,
    }
  );

  return extractItem<Workspace>(res);
}

/** Delete a workspace by ID. */
export async function deleteWorkspace(
  workspaceId: string
): Promise<void> {
  await api(`/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
}