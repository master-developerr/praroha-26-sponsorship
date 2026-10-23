"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "convex/react";
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

export type DevPersonaKey = "clerk" | "logged_out";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [customError, setCustomError] = useState<string | null>(null);

  const retryAuth = useCallback(() => {
    devLog("AUTH", "Retrying authentication and profile loading...");
    setCustomError(null);
  }, []);

  const currentClerkId = clerkUser?.id ?? "";

  // Query Convex for live database profile
  const convexProfile = useQuery(
    api.users.getCurrentUser,
    currentClerkId ? { clerkId: currentClerkId } : "skip"
  );

  const isAuthenticated = clerkLoaded && Boolean(clerkUser);

  // Authenticated User Presentation
  const user = isAuthenticated && clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        fullName: clerkUser.fullName ?? clerkUser.firstName ?? "User",
        imageUrl: clerkUser.imageUrl,
      }
    : null;

  const profile: UserProfile | null | undefined =
    convexProfile !== undefined ? (convexProfile as unknown as UserProfile) : undefined;

  // Derive explicit application state
  let authState: AuthState = "AUTH_LOADING";
  const authError: string | null = customError;

  if (!clerkLoaded) {
    authState = "AUTH_LOADING";
  } else if (!isAuthenticated) {
    authState = "UNAUTHENTICATED";
  } else if (profile === undefined) {
    authState = "PROFILE_LOADING";
  } else if (profile === null) {
    authState = "PROFILE_MISSING";
  } else if (profile.role === "admin") {
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
    if (clerkSignOut) {
      try {
        await clerkSignOut({ redirectUrl: "/sign-in" });
      } catch (err) {
        console.error("[AUTH] Clerk signOut error:", err);
        window.location.href = "/sign-in";
      }
    } else {
      window.location.href = "/sign-in";
    }
    setCustomError(null);
  };


  const refetchProfile = () => {
    // Convex queries are reactive and automatically update via WebSockets
  };

  const setActivePersona = (key: DevPersonaKey) => {
    if (key === "logged_out") {
      void signOut();
    }
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
        activePersona: "clerk",
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
