import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import {
  connectSocket,
  disconnectSocket,
  type SocketNotificationPayload,
  type SocketTaskPayload,
  type SocketCommentPayload,
  type SocketActivityPayload,
} from "@/lib/socket";

/**
 * Custom hook to bind real-time Socket.IO listeners to TanStack Query caches
 * and display toast notifications for incoming events.
 */
export function useSocketEvents() {
  const { user, isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const userId = user?.id ?? (user as unknown as { _id?: string })?._id;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(userId);

    // -----------------------------------------------------------------------
    // Notifications: notification:new
    // -----------------------------------------------------------------------
    const handleNotificationNew = (data: SocketNotificationPayload) => {
      qc.setQueryData<SocketNotificationPayload[]>(["notifications"], (old = []) => [
        data,
        ...old,
      ]);
      qc.setQueryData<number>(["notifications", "unread-count"], (count = 0) => count + 1);

      toast.info(data.title || "New notification", {
        description: data.body ?? data.message ?? "",
      });
    };

    // -----------------------------------------------------------------------
    // Tasks: task:created, task:updated, task:deleted, task:statusChanged
    // -----------------------------------------------------------------------
    const handleTaskCreated = (task: SocketTaskPayload) => {
      const projectId = task.projectId;
      if (projectId) {
        qc.invalidateQueries({ queryKey: ["tasks", projectId] });
      } else {
        qc.invalidateQueries({ queryKey: ["tasks"] });
      }
      qc.invalidateQueries({ queryKey: ["dashboard"] });

      const assigneeName =
        typeof task.assignee === "object" ? task.assignee?.name : undefined;
      if (assigneeName) {
        toast.success(`Task assigned to ${assigneeName}`, {
          description: (task.title as string) ?? "New task created",
        });
      } else {
        toast.success("New task created", {
          description: (task.title as string) ?? "",
        });
      }
    };

    const handleTaskUpdated = (task: SocketTaskPayload) => {
      const taskId = task._id ?? task.id;
      const projectId = task.projectId;

      if (taskId) {
        qc.setQueryData(["task", taskId], task);
      }
      if (projectId) {
        qc.invalidateQueries({ queryKey: ["tasks", projectId] });
      } else {
        qc.invalidateQueries({ queryKey: ["tasks"] });
      }
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    };

    const handleTaskDeleted = (data: { id?: string; taskId?: string; projectId?: string }) => {
      const projectId = data.projectId;
      if (projectId) {
        qc.invalidateQueries({ queryKey: ["tasks", projectId] });
      } else {
        qc.invalidateQueries({ queryKey: ["tasks"] });
      }
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    };

    const handleTaskStatusChanged = (data: {
      id?: string;
      taskId?: string;
      status: string;
      task?: SocketTaskPayload;
      projectId?: string;
    }) => {
      const projectId = data.projectId ?? data.task?.projectId;
      if (projectId) {
        qc.invalidateQueries({ queryKey: ["tasks", projectId] });
      } else {
        qc.invalidateQueries({ queryKey: ["tasks"] });
      }
      qc.invalidateQueries({ queryKey: ["dashboard"] });

      if (
        data.status === "Done" ||
        data.status === "Completed" ||
        data.status === "done"
      ) {
        toast.success("Task completed! 🎉", {
          description: (data.task?.title as string) ?? "A task was marked as done.",
        });
      }
    };

    // -----------------------------------------------------------------------
    // Comments: comment:created, comment:updated, comment:deleted
    // -----------------------------------------------------------------------
    const handleCommentCreated = (comment: SocketCommentPayload) => {
      const taskId = comment.taskId;
      if (taskId) {
        qc.setQueryData<SocketCommentPayload[]>(["comments", taskId], (old = []) => [
          ...old,
          comment,
        ]);
      }
      const author = comment.author?.name ?? "Someone";
      toast.info(`Comment added by ${author}`, {
        description: (comment.content as string) ?? (comment.text as string) ?? "",
      });
    };

    const handleCommentUpdated = (comment: SocketCommentPayload) => {
      const taskId = comment.taskId;
      const commentId = comment._id ?? comment.id;
      if (taskId && commentId) {
        qc.setQueryData<SocketCommentPayload[]>(["comments", taskId], (old = []) =>
          old.map((c) => (c._id === commentId || c.id === commentId ? comment : c))
        );
      }
    };

    const handleCommentDeleted = (data: { id?: string; commentId?: string; taskId?: string }) => {
      const taskId = data.taskId;
      const commentId = data.commentId ?? data.id;
      if (taskId && commentId) {
        qc.setQueryData<SocketCommentPayload[]>(["comments", taskId], (old = []) =>
          old.filter((c) => c._id !== commentId && c.id !== commentId)
        );
      }
    };

    // -----------------------------------------------------------------------
    // Activity: activity:new
    // -----------------------------------------------------------------------
    const handleActivityNew = (act: SocketActivityPayload) => {
      const taskId = act.taskId;
      if (taskId) {
        qc.setQueryData<SocketActivityPayload[]>(["activity", taskId], (old = []) => [
          act,
          ...old,
        ]);
      }
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    };

    // --- Bind socket event listeners ---
    socket.on("notification:new", handleNotificationNew);
    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:deleted", handleTaskDeleted);
    socket.on("task:statusChanged", handleTaskStatusChanged);
    socket.on("comment:created", handleCommentCreated);
    socket.on("comment:updated", handleCommentUpdated);
    socket.on("comment:deleted", handleCommentDeleted);
    socket.on("activity:new", handleActivityNew);

    // --- Cleanup on unmount or logout ---
    return () => {
      socket.off("notification:new", handleNotificationNew);
      socket.off("task:created", handleTaskCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("task:deleted", handleTaskDeleted);
      socket.off("task:statusChanged", handleTaskStatusChanged);
      socket.off("comment:created", handleCommentCreated);
      socket.off("comment:updated", handleCommentUpdated);
      socket.off("comment:deleted", handleCommentDeleted);
      socket.off("activity:new", handleActivityNew);
    };
  }, [isAuthenticated, userId, qc]);
}
