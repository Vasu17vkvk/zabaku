import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  type ApiComment,
  type CreateCommentInput,
  type UpdateCommentInput,
} from "./api";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const commentKeys = {
  all: (taskId: string) => ["comments", taskId] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch comments for a task. */
export function useComments(taskId: string | null): UseQueryResult<ApiComment[]> {
  return useQuery({
    queryKey: commentKeys.all(taskId ?? ""),
    queryFn: () => getComments(taskId!),
    enabled: Boolean(taskId),
    staleTime: 10_000,
  });
}

/** Create a comment on a task. */
export function useCreateComment(
  taskId: string | null
): UseMutationResult<ApiComment, Error, CreateCommentInput | string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => createComment(taskId!, input),
    onSuccess: () => {
      if (taskId) {
        qc.invalidateQueries({ queryKey: commentKeys.all(taskId) });
        qc.invalidateQueries({ queryKey: ["tasks"] });
        qc.invalidateQueries({ queryKey: ["activity", taskId] });
      }
    },
  });
}

/** Update an existing comment. */
export function useUpdateComment(
  taskId: string | null
): UseMutationResult<ApiComment, Error, { commentId: string; input: UpdateCommentInput | string }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, input }) => updateComment(commentId, input),
    onSuccess: () => {
      if (taskId) {
        qc.invalidateQueries({ queryKey: commentKeys.all(taskId) });
        qc.invalidateQueries({ queryKey: ["activity", taskId] });
      }
    },
  });
}

/** Delete a comment. */
export function useDeleteComment(
  taskId: string | null
): UseMutationResult<void, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      if (taskId) {
        qc.invalidateQueries({ queryKey: commentKeys.all(taskId) });
        qc.invalidateQueries({ queryKey: ["tasks"] });
        qc.invalidateQueries({ queryKey: ["activity", taskId] });
      }
    },
  });
}
