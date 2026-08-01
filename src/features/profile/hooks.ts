import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  updatePreferences,
  type UserProfile,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type UserPreferences,
} from "./api";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const profileKeys = {
  me: ["profile", "me"] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch current user profile. */
export function useProfile(): UseQueryResult<UserProfile> {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: getProfile,
    staleTime: 30_000,
  });
}

/** Update user profile. */
export function useUpdateProfile(): UseMutationResult<
  UserProfile,
  Error,
  UpdateProfileInput
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      qc.setQueryData(profileKeys.me, updated);
      qc.invalidateQueries({ queryKey: profileKeys.me });
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

/** Upload avatar image. */
export function useUploadAvatar(): UseMutationResult<
  UserProfile,
  Error,
  File | string
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (updated) => {
      qc.setQueryData(profileKeys.me, updated);
      qc.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}

/** Change user password. */
export function useChangePassword(): UseMutationResult<
  void,
  Error,
  ChangePasswordInput
> {
  return useMutation({
    mutationFn: changePassword,
  });
}

/** Update user preferences (notifications, theme, etc.). */
export function useUpdatePreferences(): UseMutationResult<
  UserProfile,
  Error,
  UserPreferences
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: (updated) => {
      qc.setQueryData(profileKeys.me, updated);
      qc.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}
