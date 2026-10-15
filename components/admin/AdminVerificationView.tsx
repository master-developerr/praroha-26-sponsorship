"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { VerificationBadge, RoleBadge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  Eye,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  Calendar,
  Search,
  RotateCcw,
  UserCog,
  Briefcase,
  PhoneCall,
  Award,
  Sparkles,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export function AdminVerificationView() {
  const { user } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "suspended" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Inspect User Modal
  const [inspectUserId, setInspectUserId] = useState<Id<"users"> | null>(null);

  // Reject Modal
  const [rejectingUser, setRejectingUser] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Convex Queries and Mutations
  const allUsers = useQuery(api.users.getUsersByVerification, {});
  const approveMutation = useMutation(api.users.approveVolunteer);
  const rejectMutation = useMutation(api.users.rejectVolunteer);
  const suspendMutation = useMutation(api.users.suspendVolunteer);
  const restoreMutation = useMutation(api.users.restoreVolunteer);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const adminClerkId = user?.id ?? "user_dev_admin_lead";

  const handleApprove = async (userId: Id<"users">) => {
    setActionLoadingId(userId);
    try {
      await approveMutation({
        userId,
        adminClerkId,
      });
      if (inspectUserId === userId) {
        setInspectUserId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectError("A rejection reason is required for feedback.");
      return;
    }

    setIsRejecting(true);
    setRejectError("");
    try {
      await rejectMutation({
        userId: rejectingUser._id,
        adminClerkId,
        reason: rejectionReason.trim(),
      });
      setRejectingUser(null);
      setRejectionReason("");
      if (inspectUserId === rejectingUser._id) {
        setInspectUserId(null);
      }
    } catch (err: any) {
      console.error(err);
      setRejectError(err.message || "Failed to reject user.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSuspend = async (userId: Id<"users">) => {
    setActionLoadingId(userId);
    try {
      await suspendMutation({
        userId,
        adminClerkId,
      });
      if (inspectUserId === userId) {
        setInspectUserId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestore = async (userId: Id<"users">) => {
    setActionLoadingId(userId);
    try {
      await restoreMutation({
        userId,
        adminClerkId,
      });
      if (inspectUserId === userId) {
        setInspectUserId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter users based on tab and search
  const filteredUsers = (allUsers || []).filter((u) => {
    const matchesTab = activeTab === "all" ? true : u.verificationStatus === activeTab;
    const matchesSearch =
      searchQuery.trim() === "" ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const pendingCount = (allUsers || []).filter((u) => u.verificationStatus === "pending").length;
  const approvedCount = (allUsers || []).filter((u) => u.verificationStatus === "approved").length;
  const rejectedCount = (allUsers || []).filter((u) => u.verificationStatus === "rejected").length;
  const suspendedCount = (allUsers || []).filter((u) => u.verificationStatus === "suspended").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Volunteer & Team Management
          </h1>
          <p className="mt-1 text-xs text-text-secondary">
            Audit SDR registrations, adjust permissions, monitor workload velocity, and grant outreach clearances.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border-subtle pb-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
              activeTab === "pending"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
            }`}
          >
            Pending Verification
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === "pending" ? "bg-black/20 text-white" : "bg-amber-100 text-amber-800"
              }`}
            >
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              activeTab === "approved"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
            }`}
          >
            Approved Volunteers
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === "approved" ? "bg-black/20 text-white" : "bg-surface-subtle text-text-muted"
              }`}
            >
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              activeTab === "rejected"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
            }`}
          >
            Rejected
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === "rejected" ? "bg-black/20 text-white" : "bg-surface-subtle text-text-muted"
              }`}
            >
              {rejectedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("suspended")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              activeTab === "suspended"
                ? "bg-amber-700 text-white shadow-xs"
                : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
            }`}
          >
            Suspended
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === "suspended" ? "bg-black/20 text-white" : "bg-surface-subtle text-text-muted"
              }`}
            >
              {suspendedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-text-primary text-white shadow-xs"
                : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
            }`}
          >
            All Registered ({(allUsers || []).length})
          </button>
        </div>

        {/* Search Filter Bar */}
        <div className="flex items-center justify-between py-3 border-b border-border-subtle">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Filter by name, phone, department, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-surface-subtle pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
            />
          </div>
        </div>

        {/* Table Content */}
        {filteredUsers.length === 0 ? (
          <div className="py-8">
            <EmptyState
              icon={UserCheck}
              title={
                activeTab === "pending"
                  ? "No pending registrations"
                  : `No ${activeTab} volunteers found`
              }
              description={
                activeTab === "pending"
                  ? "All volunteer applications have been reviewed. New submissions will appear here automatically."
                  : "Try clearing your search query or switching tabs."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="border-b border-border-subtle bg-surface-subtle/50 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="px-4 py-3">Volunteer Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-surface-subtle/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-mint text-[11px] font-bold text-accent-mint-text">
                          {item.name[0]?.toUpperCase() || "V"}
                        </div>
                        <div>
                          <p>{item.name}</p>
                          <p className="text-[10px] text-text-muted font-normal">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {item.department}
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {item.semester}
                    </td>
                    <td className="px-4 py-3 font-mono text-text-secondary">
                      {item.phone}
                    </td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={item.role} />
                    </td>
                    <td className="px-4 py-3">
                      <VerificationBadge status={item.verificationStatus} />
                    </td>
                    <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                      {/* View Action */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInspectUserId(item._id)}
                        className="h-7 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Inspect
                      </Button>

                      {/* Approve Action */}
                      {item.verificationStatus === "pending" && (
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={actionLoadingId === item._id}
                          onClick={() => handleApprove(item._id)}
                          className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      )}

                      {/* Restore Action */}
                      {(item.verificationStatus === "suspended" || item.verificationStatus === "rejected") && (
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={actionLoadingId === item._id}
                          onClick={() => handleRestore(item._id)}
                          className="h-7 px-2.5 text-xs text-emerald-700 hover:bg-emerald-50 border-emerald-300"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Restore
                        </Button>
                      )}

                      {/* Reject Action */}
                      {item.verificationStatus === "pending" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setRejectingUser(item);
                            setRejectionReason("");
                            setRejectError("");
                          }}
                          className="h-7 px-2.5 text-xs"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      )}

                      {/* Suspend Action */}
                      {item.verificationStatus === "approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={actionLoadingId === item._id}
                          onClick={() => handleSuspend(item._id)}
                          className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Volunteer Modal */}
      {inspectUserId && (
        <VolunteerInspectionModal
          userId={inspectUserId}
          onClose={() => setInspectUserId(null)}
          adminClerkId={adminClerkId}
          onApprove={handleApprove}
          onSuspend={handleSuspend}
          onRestore={handleRestore}
          onStartReject={(user) => {
            setRejectingUser(user);
            setRejectionReason("");
            setRejectError("");
          }}
        />
      )}

      {/* Reject Reason Dialog */}
      {rejectingUser && (
        <Dialog
          isOpen={true}
          onClose={() => setRejectingUser(null)}
          title="Reject Volunteer Application"
          description={`Please provide a specific reason for rejecting ${rejectingUser.name}'s application.`}
        >
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Reason for Rejection (Mandatory)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Incomplete departmental credentials, invalid mobile number, or non-SOE registration."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-3 text-xs text-text-primary focus:border-error focus:outline-none focus:ring-2 focus:ring-error/15"
              />
              {rejectError && (
                <p className="text-xs text-error font-medium mt-1">{rejectError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setRejectingUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                isLoading={isRejecting}
                onClick={handleConfirmReject}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

interface VolunteerInspectionModalProps {
  userId: Id<"users">;
  onClose: () => void;
  adminClerkId: string;
  onApprove: (id: Id<"users">) => Promise<void>;
  onSuspend: (id: Id<"users">) => Promise<void>;
  onRestore: (id: Id<"users">) => Promise<void>;
  onStartReject: (user: any) => void;
}

function VolunteerInspectionModal({
  userId,
  onClose,
  adminClerkId,
  onApprove,
  onSuspend,
  onRestore,
  onStartReject,
}: VolunteerInspectionModalProps) {
  const profile = useQuery(api.users.getVolunteerDetailedProfile, { userId });
  const setUserRoleMutation = useMutation(api.users.setUserRole);
  const [roleChanging, setRoleChanging] = useState(false);

  if (!profile) {
    return (
      <Dialog isOpen={true} onClose={onClose} title="Loading Volunteer Profile...">
        <div className="py-8 flex justify-center items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </Dialog>
    );
  }

  const handleToggleRole = async () => {
    const nextRole = profile.role === "admin" ? "volunteer" : "admin";
    if (confirm(`Are you sure you want to change this user's role to "${nextRole}"?`)) {
      setRoleChanging(true);
      try {
        await setUserRoleMutation({
          userId: profile._id,
          role: nextRole,
          adminClerkId,
        });
      } catch (err: any) {
        alert(err.message || "Failed to change user role.");
      } finally {
        setRoleChanging(false);
      }
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title="Volunteer Performance & Credentials"
      description={`Profile registered on ${formatDate(profile.createdAt)}`}
    >
      <div className="space-y-4 pt-2">
        {/* Workload Velocity Metrics */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center justify-center gap-1">
              <Briefcase className="h-3 w-3 text-primary" /> Active Leads
            </span>
            <p className="mt-1 text-lg font-bold text-text-primary">
              {profile.activeLeadsCount}
            </p>
          </div>
          <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center justify-center gap-1">
              <PhoneCall className="h-3 w-3 text-blue-600" /> Calls Logged
            </span>
            <p className="mt-1 text-lg font-bold text-text-primary">
              {profile.callsCount}
            </p>
          </div>
          <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center justify-center gap-1">
              <Award className="h-3 w-3 text-emerald-600" /> Deals Won
            </span>
            <p className="mt-1 text-lg font-bold text-text-primary">
              {profile.dealsWonCount}
            </p>
          </div>
          <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Points
            </span>
            <p className="mt-1 text-lg font-bold text-text-primary">
              {(profile.recentPoints || []).reduce((acc: number, p: any) => acc + (p.points || 0), 0)}
            </p>
          </div>
        </div>

        {/* Identity Details */}
        <div className="rounded-xl border border-border bg-surface-subtle p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-text-secondary">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Full Name
            </span>
            <span className="font-bold text-text-primary text-sm">
              {profile.name}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-2">
            <span className="flex items-center gap-2 text-text-secondary">
              <Mail className="h-4 w-4 text-text-muted" />
              Email
            </span>
            <span className="font-medium text-text-primary">
              {profile.email}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-2">
            <span className="flex items-center gap-2 text-text-secondary">
              <Phone className="h-4 w-4 text-text-muted" />
              Phone Number
            </span>
            <span className="font-mono font-medium text-text-primary">
              {profile.phone}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-2">
            <span className="flex items-center gap-2 text-text-secondary">
              <Building2 className="h-4 w-4 text-text-muted" />
              Department
            </span>
            <span className="font-medium text-text-primary">
              {profile.department}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-2">
            <span className="flex items-center gap-2 text-text-secondary">
              <GraduationCap className="h-4 w-4 text-text-muted" />
              Semester
            </span>
            <span className="font-medium text-text-primary">
              Semester {profile.semester}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-2">
            <span className="flex items-center gap-2 text-text-secondary">
              <UserCog className="h-4 w-4 text-text-muted" />
              System Role
            </span>
            <div className="flex items-center gap-2">
              <RoleBadge role={profile.role} />
              <Button
                variant="outline"
                size="sm"
                isLoading={roleChanging}
                onClick={handleToggleRole}
                className="h-6 px-2 text-[10px]"
              >
                {profile.role === "admin" ? "Demote to Volunteer" : "Promote to Admin"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-2">
            <span className="flex items-center gap-2 text-text-secondary">
              <Calendar className="h-4 w-4 text-text-muted" />
              Verification Status
            </span>
            <VerificationBadge status={profile.verificationStatus} />
          </div>

          {profile.rejectionReason && (
            <div className="border-t border-border-subtle pt-2 text-rose-700 bg-rose-50 p-2.5 rounded-lg">
              <p className="font-semibold">Rejection Reason:</p>
              <p className="mt-0.5">{profile.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {profile.verificationStatus === "approved" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSuspend(profile._id)}
                className="text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Suspend Account
              </Button>
            )}
            {(profile.verificationStatus === "suspended" || profile.verificationStatus === "rejected") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRestore(profile._id)}
                className="text-emerald-700 hover:bg-emerald-50 border-emerald-300"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Restore Account
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" onClick={onClose}>
              Close
            </Button>

            {profile.verificationStatus === "pending" && (
              <>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => onStartReject(profile)}
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onApprove(profile._id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Approve Registration
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

