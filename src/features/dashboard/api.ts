import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiDashboardTaskStatusCounts {
  todo?: number;
  in_progress?: number;
  review?: number;
  done?: number;
  [key: string]: number | undefined;
}

export interface ApiDashboardTaskPriorityCounts {
  Urgent?: number;
  High?: number;
  Medium?: number;
  Low?: number;
  [key: string]: number | undefined;
}

export interface ApiDashboardRecentTask {
  _id?: string;
  id?: string;
  key?: string;
  title?: string;
  name?: string;
  status?: string;
  priority?: string;
  progress?: number;
  dueDate?: string;
  due?: string;
  updatedAt?: string;
  project?: {
    name?: string;
    key?: string;
    color?: string;
  };
}

export interface ApiDashboardRecentProject {
  _id?: string;
  id?: string;
  key?: string;
  name?: string;
  owner?: string;
  ownerColor?: string;
  status?: string;
  statusTone?: string;
  progress?: number;
  due?: string;
  dueDate?: string;
}

export interface ApiDashboardActivityItem {
  who?: string;
  color?: string;
  initials?: string;
  action?: string;
  target?: string;
  time?: string;
  icon?: string;
  tone?: string;
}

export interface ApiDashboardData {
  totalWorkspaces?: number;
  totalProjects?: number;
  totalTasks?: number;
  completedTasks?: number;
  shippedTasks?: number;
  inProgressTasks?: number;
  completionRate?: number;
  aiRequestsCount?: number;
  tasksByStatus?: ApiDashboardTaskStatusCounts;
  tasksByPriority?: ApiDashboardTaskPriorityCounts;
  recentTasks?: ApiDashboardRecentTask[];
  recentProjects?: ApiDashboardRecentProject[];
  recentActivity?: ApiDashboardActivityItem[];
  velocity?: {
    weeks?: string[];
    planned?: number[];
    shipped?: number[];
    percentageChange?: number;
  };
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

type Envelope = {
  data?: ApiDashboardData;
  dashboard?: ApiDashboardData;
  stats?: ApiDashboardData;
};

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Fetch dashboard overview statistics. */
export async function getDashboard(): Promise<ApiDashboardData> {
  const res = await api<Envelope | ApiDashboardData>("/dashboard");
  if (res && typeof res === "object") {
    if ("totalWorkspaces" in res || "totalProjects" in res || "totalTasks" in res || "tasksByStatus" in res) {
      return res as ApiDashboardData;
    }
    const env = res as Envelope;
    if (env.data) return env.data;
    if (env.dashboard) return env.dashboard;
    if (env.stats) return env.stats;
  }
  return (res as ApiDashboardData) ?? {};
}
