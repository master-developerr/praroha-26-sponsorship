"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserProfile, UserRole, VolunteerVerificationStatus } from "@/types";
import { useUser, useClerk } from "@clerk/nextjs";

export type DevPersonaKey =
  | "clerk"
  | "approved_volunteer"
  | "pending_volunteer"
  | "rejected_volunteer"
  | "suspended_volunteer"
  | "admin_lead"
  | "new_user"
  | "logged_out";

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
  activePersona: DevPersonaKey;
  setActivePersona: (key: DevPersonaKey) => void;
  signOut: () => Promise<void>;
  refetchProfile: () => void;
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

  // Default strictly to real Clerk identity in all normal operation
  const [activePersona, setActivePersona] = useState<DevPersonaKey>("clerk");
  const [isPending, startTransition] = useTransition();

  const isDevSwitcherEnabled = process.env.NEXT_PUBLIC_ENABLE_DEV_SWITCHER === "true";

  // If Clerk user is logged in, ensure clerk mode is active
  useEffect(() => {
    if (clerkUser) {
      setActivePersona("clerk");
    }
  }, [clerkUser]);

  // Determine current active clerkId
  const currentClerkId =
    !isDevSwitcherEnabled || activePersona === "clerk"
      ? clerkUser?.id ?? ""
      : activePersona === "logged_out"
      ? ""
      : DEV_PERSONAS[activePersona]?.id ?? "";

  // Query Convex for the active clerkId
  const convexProfile = useQuery(
    api.users.getCurrentUser,
    currentClerkId ? { clerkId: currentClerkId } : "skip"
  );

  // If in dev persona mode and profile doesn't exist yet in convex, seed it
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
        } else if (
          convexProfile &&
          convexProfile.verificationStatus !== persona.defaultProfile.verificationStatus &&
          activePersona === "rejected_volunteer"
        ) {
          seedStatusMutation({
            clerkId: persona.id,
            verificationStatus: persona.defaultProfile.verificationStatus,
            rejectionReason: persona.defaultProfile.rejectionReason,
          });
        }
      }
    }
  }, [activePersona, convexProfile, registerMutation, setRoleMutation, seedStatusMutation]);

  const isAuthenticated = activePersona !== "logged_out" && !!currentClerkId;

  // Active user representation
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

  // Resolved profile
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

  const hasProfile =
    !!profile &&
    (profile.role === "admin" ||
      (!!profile.name &&
        profile.name.trim() !== "" &&
        !!profile.phone &&
        profile.phone.trim() !== "" &&
        !!profile.department &&
        profile.department.trim() !== "" &&
        !!profile.semester &&
        profile.semester.trim() !== ""));
  const role = profile?.role ?? null;
  const verificationStatus = profile?.verificationStatus ?? null;
  const isLoading = !clerkLoaded || (isAuthenticated && profile === undefined);

  const signOut = async () => {
    if (activePersona === "clerk" && clerkSignOut) {
      await clerkSignOut();
    }
    setActivePersona("logged_out");
  };

  const refetchProfile = () => {
    // Convex queries are reactive, automatic updates happen via subscription
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
        activePersona,
        setActivePersona,
        signOut,
        refetchProfile,
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
