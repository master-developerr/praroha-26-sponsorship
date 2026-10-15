"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserProfile, UserRole, VolunteerVerificationStatus } from "@/types";
import { useUser, useClerk } from "@clerk/nextjs";

export type AuthState =
  | "AUTH_LOADING"
  | "UNAUTHENTICATED"
  | "PROFILE_LOADING"
  | "PROFILE_MISSING"
  | "PENDING"
  | "APPROVED_VOLUNTEER"
  | "REJECTED"
  | "SUSPENDED"
  | "ADMIN"
  | "ERROR";

export type DevPersonaKey =
  | "clerk"
  | "approved_volunteer"
  | "pending_volunteer"
  | "rejected_volunteer"
  | "suspended_volunteer"
  | "admin_lead"
  | "new_user"
  | "logged_out";

/**
 * Structured diagnostic logger for development.
 * Automatically stripped/no-op in production builds.
 */
export function devLog(
  tag: "AUTH" | "PROFILE" | "ROLE" | "STATUS" | "WORKSPACE" | "LEADS",
  message: string,
  data?: unknown
) {
  if (process.env.NODE_ENV !== "production") {
    if (data !== undefined) {
      console.log(`[${tag}] ${message}`, data);
    } else {
      console.log(`[${tag}] ${message}`);
    }
  }
}

interface AuthContextType {
  user: {
    id: string;
    email: string;
    fullName: string;
    imageUrl?: string;
  } | null;
  profile: UserProfile | null | undefined;
  role: UserRole | null;
  verificationStatus: VolunteerVerificationStatus | null;
  hasProfile: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  authState: AuthState;
  authError: string | null;
  activePersona: DevPersonaKey;
  setActivePersona: (key: DevPersonaKey) => void;
  signOut: () => Promise<void>;
  refetchProfile: () => void;
  retryAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_PERSONAS: Record<
  Exclude<DevPersonaKey, "clerk" | "logged_out">,
  {
    id: string;
    email: string;
    fullName: string;
    defaultProfile: UserProfile;
  }
> = {
  approved_volunteer: {
    id: "user_dev_approved_volunteer",
    email: "arjun.nair@cusat.ac.in",
    fullName: "Arjun Nair",
    defaultProfile: {
      clerkId: "user_dev_approved_volunteer",
      email: "arjun.nair@cusat.ac.in",
      name: "Arjun Nair",
      phone: "9876543210",
      semester: "S6",
      department: "Computer Science & Engineering",
      role: "volunteer",
      verificationStatus: "approved",
      createdAt: Date.now() - 86400000 * 3,
    },
  },
  pending_volunteer: {
    id: "user_dev_pending_volunteer",
    email: "rahul.sharma@cusat.ac.in",
    fullName: "Rahul Sharma",
    defaultProfile: {
      clerkId: "user_dev_pending_volunteer",
      email: "rahul.sharma@cusat.ac.in",
      name: "Rahul Sharma",
      phone: "9845123456",
      semester: "S4",
      department: "Civil Engineering",
      role: "volunteer",
      verificationStatus: "pending",
      createdAt: Date.now() - 86400000 * 1,
    },
  },
  rejected_volunteer: {
    id: "user_dev_rejected_volunteer",
    email: "ananya.sen@cusat.ac.in",
    fullName: "Ananya Sen",
    defaultProfile: {
      clerkId: "user_dev_rejected_volunteer",
      email: "ananya.sen@cusat.ac.in",
      name: "Ananya Sen",
      phone: "9765432189",
      semester: "S5",
      department: "Information Technology",
      role: "volunteer",
      verificationStatus: "rejected",
      rejectionReason: "Incomplete departmental verification details. Please update your registration.",
      createdAt: Date.now() - 86400000 * 2,
    },
  },
  suspended_volunteer: {
    id: "user_dev_suspended_volunteer",
    email: "kiran.raj@cusat.ac.in",
    fullName: "Kiran Raj",
    defaultProfile: {
      clerkId: "user_dev_suspended_volunteer",
      email: "kiran.raj@cusat.ac.in",
      name: "Kiran Raj",
      phone: "9988776655",
      semester: "S7",
      department: "Electronics & Communication",
      role: "volunteer",
      verificationStatus: "suspended",
      createdAt: Date.now() - 86400000 * 5,
    },
  },
  admin_lead: {
    id: "user_dev_admin_lead",
    email: "siddharth.menon@cusat.ac.in",
    fullName: "Siddharth Menon (Lead)",
    defaultProfile: {
      clerkId: "user_dev_admin_lead",
      email: "siddharth.menon@cusat.ac.in",
      name: "Siddharth Menon",
      phone: "9123456780",
      semester: "S8",
      department: "Civil Engineering",
      role: "admin",
      verificationStatus: "approved",
      createdAt: Date.now() - 86400000 * 10,
    },
  },
  new_user: {
    id: "user_dev_new_unregistered",
    email: "new.student@cusat.ac.in",
    fullName: "New Student",
    defaultProfile: null as unknown as UserProfile,
  },
};

const AUTH_TIMEOUT_MS = 8000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let clerkUser = null;
  let clerkLoaded = true;
  let clerkSignOut: (() => Promise<void>) | null = null;

  try {
    const clerk = useUser();
    clerkUser = clerk.user;
    clerkLoaded = clerk.isLoaded;
    const clerkHook = useClerk();
    clerkSignOut = clerkHook.signOut;
  } catch {
    // Clerk not wrapped or unavailable
    clerkLoaded = true;
  }

  // Strictly enforce real auth in production
  const isProduction = process.env.NODE_ENV === "production";
  const isDevSwitcherEnabled = !isProduction && process.env.NEXT_PUBLIC_ENABLE_DEV_SWITCHER === "true";

  // Default strictly to real Clerk identity
  const [activePersona, setActivePersonaState] = useState<DevPersonaKey>("clerk");
  const [timedOut, setTimedOut] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const setActivePersona = useCallback(
    (key: DevPersonaKey) => {
      if (!isDevSwitcherEnabled) {
        console.warn("[AUTH] Dev persona switching is disabled in production.");
        return;
      }
      setActivePersonaState(key);
      setTimedOut(false);
      setCustomError(null);
    },
    [isDevSwitcherEnabled]
  );

  const retryAuth = useCallback(() => {
    devLog("AUTH", "Retrying authentication and profile loading...");
    setTimedOut(false);
    setCustomError(null);
    setRetryKey((k) => k + 1);
  }, []);

  // If real Clerk user logs in, ensure clerk persona is active
  useEffect(() => {
    if (clerkUser) {
      setActivePersonaState("clerk");
    }
  }, [clerkUser]);

  // Determine active clerk ID
  const currentClerkId =
    !isDevSwitcherEnabled || activePersona === "clerk"
      ? clerkUser?.id ?? ""
      : activePersona === "logged_out"
      ? ""
      : DEV_PERSONAS[activePersona]?.id ?? "";

  // Query Convex for live profile
  const convexProfile = useQuery(
    api.users.getCurrentUser,
    currentClerkId ? { clerkId: currentClerkId } : "skip"
  );

  // Fallback timer: NEVER let the UI wait indefinitely
  useEffect(() => {
    // If not authenticated or profile has cleanly resolved, no timeout needed
    if (!currentClerkId || convexProfile !== undefined) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      devLog("AUTH", `Auth initialization timed out after ${AUTH_TIMEOUT_MS}ms`);
      setTimedOut(true);
    }, AUTH_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [currentClerkId, convexProfile, retryKey]);

  // Dev mode: automatic seeding of test personas
  const registerMutation = useMutation(api.users.registerVolunteerProfile);
  const setRoleMutation = useMutation(api.users.setUserRole);
  const seedStatusMutation = useMutation(api.users.seedDevUserStatus);

  useEffect(() => {
    if (!isDevSwitcherEnabled) return;
    if (
      activePersona !== "clerk" &&
      activePersona !== "logged_out" &&
      activePersona !== "new_user"
    ) {
      const persona = DEV_PERSONAS[activePersona];
      if (persona && persona.defaultProfile) {
        if (convexProfile === null) {
          registerMutation({
            clerkId: persona.id,
            email: persona.email,
            name: persona.fullName,
            phone: persona.defaultProfile.phone,
            semester: persona.defaultProfile.semester,
            department: persona.defaultProfile.department,
          }).then(async (userId) => {
            if (persona.defaultProfile.role === "admin") {
              await setRoleMutation({
                userId,
                role: "admin",
                adminClerkId: persona.id,
              });
            }
            if (persona.defaultProfile.verificationStatus !== "pending") {
              await seedStatusMutation({
                clerkId: persona.id,
                verificationStatus: persona.defaultProfile.verificationStatus,
                rejectionReason: persona.defaultProfile.rejectionReason,
                role: persona.defaultProfile.role,
              });
            }
          });
        }
      }
    }
  }, [activePersona, convexProfile, registerMutation, setRoleMutation, seedStatusMutation, isDevSwitcherEnabled]);

  const isAuthenticated =
    (activePersona !== "logged_out" && !!currentClerkId) ||
    (isDevSwitcherEnabled && activePersona !== "logged_out" && activePersona !== "clerk");

  // User presentation
  const user = isAuthenticated
    ? isDevSwitcherEnabled && activePersona !== "clerk" && DEV_PERSONAS[activePersona as keyof typeof DEV_PERSONAS]
      ? {
          id: DEV_PERSONAS[activePersona as keyof typeof DEV_PERSONAS].id,
          email: DEV_PERSONAS[activePersona as keyof typeof DEV_PERSONAS].email,
          fullName: DEV_PERSONAS[activePersona as keyof typeof DEV_PERSONAS].fullName,
          imageUrl: undefined,
        }
      : clerkUser
      ? {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          fullName: clerkUser.fullName ?? clerkUser.firstName ?? "User",
          imageUrl: clerkUser.imageUrl,
        }
      : null
    : null;

  // Resolved database profile
  const profile: UserProfile | null | undefined =
    isDevSwitcherEnabled && activePersona === "new_user"
      ? convexProfile === undefined
        ? undefined
        : null
      : convexProfile !== undefined
      ? (convexProfile as unknown as UserProfile)
      : isDevSwitcherEnabled && activePersona !== "clerk" && activePersona !== "logged_out"
      ? DEV_PERSONAS[activePersona as keyof typeof DEV_PERSONAS]?.defaultProfile
      : undefined;

  // Derive explicit application state
  let authState: AuthState = "AUTH_LOADING";
  let authError: string | null = customError;

  if (timedOut) {
    authState = "ERROR";
    authError =
      "Connection to PRAROHA'26 services timed out. Please check your network connection or verify that the Convex backend is accessible.";
  } else if (!clerkLoaded) {
    authState = "AUTH_LOADING";
  } else if (!isAuthenticated) {
    authState = "UNAUTHENTICATED";
  } else if (profile === undefined) {
    // Waiting for Convex query
    authState = "PROFILE_LOADING";
  } else if (profile === null) {
    // Authenticated in Clerk, but no record in Convex DB yet -> needs onboarding
    authState = "PROFILE_MISSING";
  } else if (profile.role === "admin") {
    // Admin role takes precedence
    authState = "ADMIN";
  } else {
    // Check if mandatory volunteer registration fields are complete
    const hasCompleteFields = Boolean(
      profile.name &&
        profile.name.trim() !== "" &&
        profile.phone &&
        profile.phone.trim() !== "" &&
        profile.department &&
        profile.department.trim() !== "" &&
        profile.semester &&
        profile.semester.trim() !== ""
    );

    if (!hasCompleteFields) {
      authState = "PROFILE_MISSING";
    } else {
      const status = profile.verificationStatus;
      if (status === "approved") {
        authState = "APPROVED_VOLUNTEER";
      } else if (status === "rejected") {
        authState = "REJECTED";
      } else if (status === "suspended") {
        authState = "SUSPENDED";
      } else {
        authState = "PENDING";
      }
    }
  }

  const role: UserRole | null = profile?.role ?? (authState === "ADMIN" ? "admin" : null);
  const verificationStatus: VolunteerVerificationStatus | null =
    profile?.verificationStatus ?? (authState === "ADMIN" ? "approved" : null);

  const hasProfile =
    authState === "APPROVED_VOLUNTEER" ||
    authState === "PENDING" ||
    authState === "REJECTED" ||
    authState === "SUSPENDED" ||
    authState === "ADMIN";

  const isLoading = authState === "AUTH_LOADING" || authState === "PROFILE_LOADING";

  // Structured dev logging
  const prevLogState = useRef<string>("");
  useEffect(() => {
    const logKey = `${authState}-${role}-${verificationStatus}`;
    if (prevLogState.current !== logKey) {
      prevLogState.current = logKey;
      devLog("AUTH", `Resolved Auth State: ${authState}`, {
        role,
        verificationStatus,
        hasProfile,
        clerkId: currentClerkId,
      });
    }
  }, [authState, role, verificationStatus, hasProfile, currentClerkId]);

  const signOut = async () => {
    devLog("AUTH", "Signing out...");
    if (activePersona === "clerk" && clerkSignOut) {
      try {
        await clerkSignOut();
      } catch (err) {
        console.error("[AUTH] Clerk signOut error:", err);
      }
    }
    setActivePersonaState("logged_out");
    setTimedOut(false);
    setCustomError(null);
  };

  const refetchProfile = () => {
    // Convex queries are reactive and automatically update via WebSockets
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        verificationStatus,
        hasProfile,
        isLoading,
        isAuthenticated,
        authState,
        authError,
        activePersona,
        setActivePersona,
        signOut,
        refetchProfile,
        retryAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthUser must be used within an AuthProvider");
  }
  return context;
}
