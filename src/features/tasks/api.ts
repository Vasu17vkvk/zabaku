import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TaskStatusKey = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "Urgent" | "High" | "Medium" | "Low";

export interface ApiTaskMember {
  _id?: string;
  id?: string;
  name?: string;
  initials?: string;
  color?: string;
  avatarUrl?: string;
  role?: string;
}

export interface ApiTaskTag {
  label: string;
  color?: string;
}

export interface ApiTaskProject {
  _id?: string;
  id?: string;
  key?: string;
  name?: string;
  color?: string;
}

export interface ApiTask {
  _id: string;
  id?: string;
  key?: string;
  title: string;
  description?: string;
  status: TaskStatusKey;
  priority?: TaskPriority;
  dueDate?: string;
  members?: ApiTaskMember[];
  assignees?: ApiTaskMember[];
  tags?: ApiTaskTag[] | string[];
  checklistDone?: number;
  checklistTotal?: number;
  subtasksCompleted?: number;
  subtasksTotal?: number;
  commentsCount?: number;
  attachmentsCount?: number;
  project?: ApiTaskProject;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
  order?: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatusKey;
  priority?: TaskPriority;
  dueDate?: string;
  memberIds?: string[];
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatusKey;
  priority?: TaskPriority;
  dueDate?: string;
  memberIds?: string[];
  tags?: string[];
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatusKey;
  priority?: TaskPriority;
  sort?: string;
  page?: number;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

type ListEnvelope = {
  data?: ApiTask[] | { tasks?: ApiTask[] };
  tasks?: ApiTask[];
  items?: ApiTask[];
};
type ItemEnvelope = {
  data?: ApiTask | { task?: ApiTask };
  task?: ApiTask;
};

function extractList(res: ListEnvelope | ApiTask[]): ApiTask[] {
  if (Array.isArray(res)) return res;
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    const nested = (res.data as { tasks?: ApiTask[] }).tasks;
    if (Array.isArray(nested)) return nested;
  }
  if (Array.isArray((res as ListEnvelope).tasks)) return (res as ListEnvelope).tasks!;
  if (Array.isArray((res as ListEnvelope).items)) return (res as ListEnvelope).items!;
  return [];
}

function extractItem(res: ItemEnvelope | ApiTask): ApiTask {
  if (res && typeof res === "object" && ("_id" in res || "id" in res)) {
    return res as ApiTask;
  }
  const env = res as ItemEnvelope;
  if (env.data) {
    const d = env.data as ApiTask | { task?: ApiTask };
    if ("_id" in d || "id" in d) return d as ApiTask;
    const nested = (d as { task?: ApiTask }).task;
    if (nested) return nested;
  }
  if (env.task) return env.task;
  return res as ApiTask;
}

function buildQueryString(filters: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page != null) params.set("page", String(filters.page));
  if (filters.limit != null) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function getTasks(
  projectId: string,
  filters: TaskFilters = {}
): Promise<ApiTask[]> {
  const qs = buildQueryString(filters);
  const res = await api<ListEnvelope | ApiTask[]>(
    `/projects/${projectId}/tasks${qs}`
  );
  return extractList(res);
}

export async function getTask(taskId: string): Promise<ApiTask> {
  const res = await api<ItemEnvelope | ApiTask>(`/tasks/${taskId}`);
  return extractItem(res);
}

export async function createTask(
  projectId: string,
  input: CreateTaskInput
): Promise<ApiTask> {
  const res = await api<ItemEnvelope | ApiTask>(
    `/projects/${projectId}/tasks`,
    { method: "POST", body: input }
  );
  return extractItem(res);
}

export async function updateTask(
  taskId: string,
  input: UpdateTaskInput
): Promise<ApiTask> {
  const res = await api<ItemEnvelope | ApiTask>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: input,
  });
  return extractItem(res);
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatusKey
): Promise<ApiTask> {
  const res = await api<ItemEnvelope | ApiTask>(`/tasks/${taskId}/status`, {
    method: "PATCH",
    body: { status },
  });
  return extractItem(res);
}

export async function deleteTask(taskId: string): Promise<void> {
  await api<unknown>(`/tasks/${taskId}`, { method: "DELETE" });
}
