import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationKind =
  | "mention"
  | "review"
  | "comment"
  | "invite"
  | "ai"
  | "success"
  | "warning"
  | "event"
  | "doc"
  | string;

export interface ApiNotificationActor {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  hue?: number;
}

export interface ApiNotificationActions {
  primary?: string;
  secondary?: string;
}

export interface ApiNotificationEntityRef {
  type?: "project" | "task" | "workspace" | "comment" | string;
  id?: string;
  projectId?: string;
  taskId?: string;
  url?: string;
}

export interface ApiNotification {
  _id: string;
  id?: string;
  kind?: NotificationKind;
  group?: "Today" | "Yesterday" | "This Week" | "Earlier" | string;
  actor?: ApiNotificationActor;
  title: string;
  body?: string;
  message?: string;
  description?: string;
  project?: string;
  projectName?: string;
  projectId?: string;
  taskId?: string;
  targetUrl?: string;
  link?: string;
  entityRef?: ApiNotificationEntityRef;
  time?: string;
  createdAt?: string;
  read?: boolean;
  isRead?: boolean;
  starred?: boolean;
  actions?: ApiNotificationActions;
}

export interface UnreadCountResponse {
  unreadCount?: number;
  count?: number;
  unread?: number;
}

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

type ListEnvelope = {
  data?: ApiNotification[] | { notifications?: ApiNotification[] };
  notifications?: ApiNotification[];
  items?: ApiNotification[];
};

type ItemEnvelope = {
  data?: ApiNotification | { notification?: ApiNotification };
  notification?: ApiNotification;
};

type CountEnvelope = {
  data?: UnreadCountResponse | number;
  unreadCount?: number;
  count?: number;
  unread?: number;
};

function extractList(res: ListEnvelope | ApiNotification[]): ApiNotification[] {
  if (Array.isArray(res)) return res;
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    const nested = (res.data as { notifications?: ApiNotification[] }).notifications;
    if (Array.isArray(nested)) return nested;
  }
  if (Array.isArray((res as ListEnvelope).notifications)) return (res as ListEnvelope).notifications!;
  if (Array.isArray((res as ListEnvelope).items)) return (res as ListEnvelope).items!;
  return [];
}

function extractItem(res: ItemEnvelope | ApiNotification): ApiNotification {
  if (res && typeof res === "object" && ("_id" in res || "id" in res)) {
    return res as ApiNotification;
  }
  const env = res as ItemEnvelope;
  if (env.data) {
    const d = env.data as ApiNotification | { notification?: ApiNotification };
    if ("_id" in d || "id" in d) return d as ApiNotification;
    const nested = (d as { notification?: ApiNotification }).notification;
    if (nested) return nested;
  }
  if (env.notification) return env.notification;
  return res as ApiNotification;
}

function extractCount(res: CountEnvelope | number): number {
  if (typeof res === "number") return res;
  if (typeof res?.unreadCount === "number") return res.unreadCount;
  if (typeof res?.count === "number") return res.count;
  if (typeof res?.unread === "number") return res.unread;
  if (typeof res?.data === "number") return res.data;
  if (typeof res?.data === "object" && res.data !== null) {
    const d = res.data as UnreadCountResponse;
    if (typeof d.unreadCount === "number") return d.unreadCount;
    if (typeof d.count === "number") return d.count;
    if (typeof d.unread === "number") return d.unread;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Fetch notifications list. */
export async function getNotifications(): Promise<ApiNotification[]> {
  const res = await api<ListEnvelope | ApiNotification[]>("/notifications");
  return extractList(res);
}

/** Fetch unread notifications count. */
export async function getUnreadCount(): Promise<number> {
  const res = await api<CountEnvelope | number>("/notifications/unread-count");
  return extractCount(res);
}

/** Mark a single notification as read. */
export async function markAsRead(notificationId: string): Promise<ApiNotification> {
  const res = await api<ItemEnvelope | ApiNotification>(
    `/notifications/${notificationId}/read`,
    { method: "PATCH" }
  );
  return extractItem(res);
}
