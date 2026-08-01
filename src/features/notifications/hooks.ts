import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  type ApiNotification,
} from "./api";

// ---------------------------------------------------------------------------
// Query keys (structured for future Socket.IO / WebSocket real-time updates)
// ---------------------------------------------------------------------------

export const notificationKeys = {
  all: ["notifications"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch all notifications. */
export function useNotifications(): UseQueryResult<ApiNotification[]> {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
    staleTime: 15_000,
  });
}

/** Fetch unread count. */
export function useUnreadNotifications(): UseQueryResult<number> {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadCount,
    staleTime: 10_000,
  });
}

/** Mark notification as read (with optimistic cache update). */
export function useMarkNotificationAsRead(): UseMutationResult<
  ApiNotification,
  Error,
  string,
  { previousNotifications: ApiNotification[] | undefined; previousCount: number | undefined }
> {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),

    // Optimistic Update
    onMutate: async (notificationId: string) => {
      await qc.cancelQueries({ queryKey: notificationKeys.all });
      await qc.cancelQueries({ queryKey: notificationKeys.unreadCount });

      const previousNotifications = qc.getQueryData<ApiNotification[]>(notificationKeys.all);
      const previousCount = qc.getQueryData<number>(notificationKeys.unreadCount);

      // Optimistically mark notification as read in list
      qc.setQueryData<ApiNotification[]>(notificationKeys.all, (old = []) =>
        old.map((n) =>
          n._id === notificationId || n.id === notificationId
            ? { ...n, read: true, isRead: true }
            : n
        )
      );

      // Optimistically decrement unread count
      if (typeof previousCount === "number" && previousCount > 0) {
        qc.setQueryData<number>(notificationKeys.unreadCount, Math.max(0, previousCount - 1));
      }

      return { previousNotifications, previousCount };
    },

    // Rollback on error
    onError: (_err, _vars, ctx) => {
      if (ctx?.previousNotifications) {
        qc.setQueryData(notificationKeys.all, ctx.previousNotifications);
      }
      if (typeof ctx?.previousCount === "number") {
        qc.setQueryData(notificationKeys.unreadCount, ctx.previousCount);
      }
    },

    // Always refetch after settle
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
      qc.invalidateQueries({ queryKey: notificationKeys.unreadCount });
    },
  });
}
