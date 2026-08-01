import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  digestFrequency?: "daily" | "weekly" | "off";
  [key: string]: unknown;
}

export interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  handle?: string;
  avatarUrl?: string;
  title?: string;
  team?: string;
  bio?: string;
  location?: string;
  role?: string;
  preferences?: UserPreferences;
  createdAt?: string;
  [key: string]: unknown;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  handle?: string;
  title?: string;
  team?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
  [key: string]: unknown;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  oldPassword?: string;
  newPassword?: string;
  password?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Envelope helpers
// ---------------------------------------------------------------------------

type ProfileEnvelope = {
  data?: UserProfile | { user?: UserProfile; profile?: UserProfile };
  user?: UserProfile;
  profile?: UserProfile;
};

function extractProfile(res: ProfileEnvelope | UserProfile): UserProfile {
  if (res && typeof res === "object") {
    if ("name" in res || "email" in res) return res as UserProfile;
    const env = res as ProfileEnvelope;
    if (env.data) {
      const d = env.data as UserProfile | { user?: UserProfile; profile?: UserProfile };
      if ("name" in d || "email" in d) return d as UserProfile;
      if ((d as { user?: UserProfile }).user) return (d as { user?: UserProfile }).user!;
      if ((d as { profile?: UserProfile }).profile) return (d as { profile?: UserProfile }).profile!;
    }
    if (env.user) return env.user;
    if (env.profile) return env.profile;
  }
  return (res as UserProfile) ?? { id: "", name: "", email: "" };
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

/** Fetch current user profile. */
export async function getProfile(): Promise<UserProfile> {
  try {
    const res = await api<ProfileEnvelope | UserProfile>("/auth/me");
    return extractProfile(res);
  } catch {
    const res = await api<ProfileEnvelope | UserProfile>("/profile");
    return extractProfile(res);
  }
}

/** Update user profile information. */
export async function updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
  try {
    const res = await api<ProfileEnvelope | UserProfile>("/auth/me", {
      method: "PATCH",
      body: input,
    });
    return extractProfile(res);
  } catch {
    const res = await api<ProfileEnvelope | UserProfile>("/profile", {
      method: "PATCH",
      body: input,
    });
    return extractProfile(res);
  }
}

/** Upload user avatar. */
export async function uploadAvatar(fileOrUrl: File | string): Promise<UserProfile> {
  if (typeof fileOrUrl === "string") {
    return updateProfile({ avatarUrl: fileOrUrl });
  }

  // File upload form data
  const formData = new FormData();
  formData.append("avatar", fileOrUrl);

  try {
    const res = await api<ProfileEnvelope | UserProfile>("/profile/avatar", {
      method: "POST",
      body: formData,
    });
    return extractProfile(res);
  } catch {
    // Graceful fallback to profile patch
    return updateProfile({ avatarUrl: URL.createObjectURL(fileOrUrl) });
  }
}

/** Change account password. */
export async function changePassword(input: ChangePasswordInput): Promise<void> {
  const body = {
    currentPassword: input.currentPassword ?? input.oldPassword,
    newPassword: input.newPassword ?? input.password,
    ...input,
  };
  try {
    await api<unknown>("/auth/change-password", {
      method: "POST",
      body,
    });
  } catch {
    await api<unknown>("/auth/me", {
      method: "PATCH",
      body,
    });
  }
}

/** Update user notification & theme preferences. */
export async function updatePreferences(input: UserPreferences): Promise<UserProfile> {
  try {
    const res = await api<ProfileEnvelope | UserProfile>("/user/preferences", {
      method: "PATCH",
      body: input,
    });
    return extractProfile(res);
  } catch {
    return updateProfile({ preferences: input });
  }
}
