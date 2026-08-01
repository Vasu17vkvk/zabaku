import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
  type ApiTeamMember,
  type InviteMemberInput,
  type TeamRole,
} from "./api";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const memberKeys = {
  all: (workspaceId: string) => ["team", workspaceId] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch all members for a workspace. */
export function useMembers(
  workspaceId: string | null
): UseQueryResult<ApiTeamMember[]> {
  return useQuery({
    queryKey: memberKeys.all(workspaceId ?? ""),
    queryFn: () => getMembers(workspaceId!),
    enabled: Boolean(workspaceId),
    staleTime: 15_000,
  });
}

/** Invite a new member. */
export function useInviteMember(
  workspaceId: string | null
): UseMutationResult<ApiTeamMember, Error, InviteMemberInput | string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => inviteMember(workspaceId!, input),
    onSuccess: () => {
      if (workspaceId) {
        qc.invalidateQueries({ queryKey: memberKeys.all(workspaceId) });
      }
    },
  });
}

/** Update a member's role. */
export function useUpdateMemberRole(
  workspaceId: string | null
): UseMutationResult<ApiTeamMember, Error, { memberId: string; role: TeamRole }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }) => updateMemberRole(workspaceId!, memberId, role),
    onSuccess: () => {
      if (workspaceId) {
        qc.invalidateQueries({ queryKey: memberKeys.all(workspaceId) });
      }
    },
  });
}

/** Remove a member. */
export function useRemoveMember(
  workspaceId: string | null
): UseMutationResult<void, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => removeMember(workspaceId!, memberId),
    onSuccess: () => {
      if (workspaceId) {
        qc.invalidateQueries({ queryKey: memberKeys.all(workspaceId) });
      }
    },
  });
}
