import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiActivityUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
  color?: string;
}

export type ActivityType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_STATUS_CHANGED"
  | "TASK_DELETED"
  | string;

export interface ApiActivity {
  _id: string;
  id?: string;
  taskId?: string;
  type?: ActivityType;
  action?: string;
  user?: ApiActivityUser;
  author?: ApiActivityUser;
  userId?: string | ApiActivityUser;
  userInitials?: string;
  userName?: string;
  userColor?: string;
  details?: {
    from?: string;
    to?: string;
    field?: string;
    title?: string;
    oldValue?: string;
    newValue?: string;
    [key: string]: unknown;
  };
  metadata?: Record<string, unknown>;
  description?: string;
  message?: string;
  createdAt?: string;
  timestamp?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

type ListEnvelope = {
  data?: ApiActivity[] | { activity?: ApiActivity[]; activities?: ApiActivity[] };
  activity?: ApiActivity[];
  activities?: ApiActivity[];
  items?: ApiActivity[];
};

function extractList(res: ListEnvelope | ApiActivity[]): ApiActivity[] {
  if (Array.isArray(res)) return res;
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    const nested = res.data as { activity?: ApiActivity[]; activities?: ApiActivity[] };
    if (Array.isArray(nested.activity)) return nested.activity;
    if (Array.isArray(nested.activities)) return nested.activities;
  }
  if (Array.isArray((res as ListEnvelope).activity)) return (res as ListEnvelope).activity!;
  if (Array.isArray((res as ListEnvelope).activities)) return (res as ListEnvelope).activities!;
  if (Array.isArray((res as ListEnvelope).items)) return (res as ListEnvelope).items!;
  return [];
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Fetch activity timeline for a task. */
export async function getTaskActivity(taskId: string): Promise<ApiActivity[]> {
  const res = await api<ListEnvelope | ApiActivity[]>(`/tasks/${taskId}/activity`);
  return extractList(res);
}
