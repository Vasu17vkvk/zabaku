import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiCommentUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
  color?: string;
  role?: string;
}

export interface ApiComment {
  _id: string;
  id?: string;
  taskId?: string;
  content?: string;
  body?: string;
  text?: string;
  user?: ApiCommentUser;
  author?: ApiCommentUser;
  userId?: string | ApiCommentUser;
  createdAt?: string;
  updatedAt?: string;
  pinned?: boolean;
  parentId?: string | null;
  replies?: ApiComment[];
}

export interface CreateCommentInput {
  content?: string;
  body?: string;
  parentId?: string;
  [key: string]: unknown;
}

export interface UpdateCommentInput {
  content?: string;
  body?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

type ListEnvelope = {
  data?: ApiComment[] | { comments?: ApiComment[] };
  comments?: ApiComment[];
  items?: ApiComment[];
};

type ItemEnvelope = {
  data?: ApiComment | { comment?: ApiComment };
  comment?: ApiComment;
};

function extractList(res: ListEnvelope | ApiComment[]): ApiComment[] {
  if (Array.isArray(res)) return res;
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    const nested = (res.data as { comments?: ApiComment[] }).comments;
    if (Array.isArray(nested)) return nested;
  }
  if (Array.isArray((res as ListEnvelope).comments)) return (res as ListEnvelope).comments!;
  if (Array.isArray((res as ListEnvelope).items)) return (res as ListEnvelope).items!;
  return [];
}

function extractItem(res: ItemEnvelope | ApiComment): ApiComment {
  if (res && typeof res === "object" && ("_id" in res || "id" in res)) {
    return res as ApiComment;
  }
  const env = res as ItemEnvelope;
  if (env.data) {
    const d = env.data as ApiComment | { comment?: ApiComment };
    if ("_id" in d || "id" in d) return d as ApiComment;
    const nested = (d as { comment?: ApiComment }).comment;
    if (nested) return nested;
  }
  if (env.comment) return env.comment;
  return res as ApiComment;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Fetch all comments for a given task. */
export async function getComments(taskId: string): Promise<ApiComment[]> {
  const res = await api<ListEnvelope | ApiComment[]>(
    `/tasks/${taskId}/comments`
  );
  return extractList(res);
}

/** Create a comment on a task. */
export async function createComment(
  taskId: string,
  input: CreateCommentInput | string
): Promise<ApiComment> {
  const body =
    typeof input === "string"
      ? { content: input, body: input }
      : { content: input.content ?? input.body, body: input.body ?? input.content, ...input };

  const res = await api<ItemEnvelope | ApiComment>(
    `/tasks/${taskId}/comments`,
    { method: "POST", body }
  );
  return extractItem(res);
}

/** Update an existing comment by ID. */
export async function updateComment(
  commentId: string,
  input: UpdateCommentInput | string
): Promise<ApiComment> {
  const body =
    typeof input === "string"
      ? { content: input, body: input }
      : { content: input.content ?? input.body, body: input.body ?? input.content, ...input };

  const res = await api<ItemEnvelope | ApiComment>(`/comments/${commentId}`, {
    method: "PATCH",
    body,
  });
  return extractItem(res);
}

/** Delete a comment by ID. */
export async function deleteComment(commentId: string): Promise<void> {
  await api<unknown>(`/comments/${commentId}`, { method: "DELETE" });
}
