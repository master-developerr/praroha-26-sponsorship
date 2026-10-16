import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Get pool of unassigned company leads with search and multi-attribute filters
 */
export const getUnassignedPool = query({
  args: {
    search: v.optional(v.string()),
    industry: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let companies = await ctx.db
      .query("companies")
      .withIndex("by_lead_status", (q) => q.eq("leadStatus", "UNASSIGNED"))
      .order("desc")
      .collect();

    if (args.industry && args.industry !== "all") {
      companies = companies.filter((c) => c.industry === args.industry);
    }
    if (args.priority && args.priority !== "all") {
      companies = companies.filter((c) => c.priority === args.priority);
    }
    if (args.search && args.search.trim().length > 0) {
      const q = args.search.toLowerCase().trim();
      companies = companies.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.niche.toLowerCase().includes(q) ||
          (c.location && c.location.toLowerCase().includes(q))
      );
    }

    // Attach primary contact and total contacts count
    const enriched = await Promise.all(
      companies.map(async (company) => {
        const contacts = await ctx.db
          .query("contacts")
          .withIndex("by_company_id", (q) => q.eq("companyId", company._id))
          .collect();

        const primaryContact =
          contacts.find((ct) => ct.isPrimary) || contacts[0] || null;

        return {
          ...company,
          primaryContact,
          totalContacts: contacts.length,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get approved volunteers roster with live active workloads
 */
export const getVolunteerRosterWithWorkload = query({
  args: {
    search: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Fetch all users and filter to active assignees (approved volunteers + active admins)
    const allUsers = await ctx.db.query("users").collect();

    let volunteers = allUsers.filter((u) => {
      // Exclude suspended or rejected users
      if (u.verificationStatus === "suspended" || u.verificationStatus === "rejected") {
        return false;
      }
      // Active admins are eligible
      if (u.role === "admin") {
        return true;
      }
      // Student SDRs must be approved
      if (u.role === "volunteer") {
        return u.verificationStatus === "approved";
      }
      return false;
    });

    if (args.department && args.department !== "all") {
      volunteers = volunteers.filter((u) => u.department === args.department);
    }

    if (args.search && args.search.trim().length > 0) {
      const q = args.search.toLowerCase().trim();
      volunteers = volunteers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q)) ||
          (u.semester && u.semester.toLowerCase().includes(q)) ||
          (u.role && u.role.toLowerCase().includes(q))
      );
    }

    // Attach live active assignment counts
    const roster = await Promise.all(
      volunteers.map(async (v) => {
        const activeAssignments = await ctx.db
          .query("leadAssignments")
          .withIndex("by_volunteer_and_status", (q) =>
            q.eq("volunteerId", v._id).eq("status", "active")
          )
          .collect();

        const activeCount = activeAssignments.length;

        let capacityStatus: "Available" | "Moderate" | "Near Capacity" = "Available";
        if (activeCount >= 15) {
          capacityStatus = "Near Capacity";
        } else if (activeCount >= 5) {
          capacityStatus = "Moderate";
        }

        return {
          ...v,
          activeLeadsCount: activeCount,
          capacityStatus,
        };
      })
    );

    // Sort by active leads ascending (workload balancing)
    return roster.sort((a, b) => a.activeLeadsCount - b.activeLeadsCount);
  },
});

/**
 * Admin action: Batch assign unassigned leads to a volunteer
 */
export const assignLeadsBatch = mutation({
  args: {
    adminClerkId: v.string(),
    companyIds: v.array(v.id("companies")),
    volunteerId: v.id("users"),
    priority: v.optional(
      v.union(
        v.literal("High"),
        v.literal("Medium"),
        v.literal("Normal"),
        v.literal("Low")
      )
    ),
    dueDate: v.optional(v.number()),
    dailyTarget: v.optional(v.number()),
    instructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can assign leads");
    }

    const volunteer = await ctx.db.get(args.volunteerId);
    if (!volunteer) {
      throw new Error("Target assignee user not found");
    }
    if (volunteer.verificationStatus === "suspended" || volunteer.verificationStatus === "rejected") {
      throw new Error("Target assignee is suspended or rejected");
    }
    if (volunteer.role === "volunteer" && volunteer.verificationStatus !== "approved") {
      throw new Error("Target volunteer is not verified or approved");
    }

    const now = Date.now();
    let assignedCount = 0;

    for (const companyId of args.companyIds) {
      const company = await ctx.db.get(companyId);
      if (!company) continue;

      // Create active lead assignment with operational directives
      await ctx.db.insert("leadAssignments", {
        companyId,
        volunteerId: args.volunteerId,
        assignedBy: admin._id,
        status: "active",
        priority: args.priority || company.priority,
        dueDate: args.dueDate,
        dailyTarget: args.dailyTarget,
        instructions: args.instructions,
        assignedAt: now,
        updatedAt: now,
      });

      // Advance company leadStatus to ASSIGNED if currently UNASSIGNED, and optionally update priority
      await ctx.db.patch(companyId, {
        leadStatus: company.leadStatus === "UNASSIGNED" ? "ASSIGNED" : company.leadStatus,
        ...(args.priority ? { priority: args.priority } : {}),
        updatedAt: now,
      });

      // Immutable audit log
      await ctx.db.insert("auditLogs", {
        actorId: admin._id,
        action: "lead_assigned",
        entityType: "companies",
        entityId: companyId,
        changes: JSON.stringify({
          companyName: company.companyName,
          assignedTo: volunteer.name,
          volunteerId: volunteer._id,
          assignedAt: now,
        }),
        timestamp: now,
      });

      assignedCount++;
    }

    return {
      success: true,
      assignedCount,
      volunteerName: volunteer.name,
    };
  },
});

/**
 * Admin action: Reassign an active lead to a new volunteer with audit tracking
 */
export const reassignLead = mutation({
  args: {
    adminClerkId: v.string(),
    companyId: v.id("companies"),
    newVolunteerId: v.id("users"),
    reassignReason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can reassign leads");
    }

    const newVolunteer = await ctx.db.get(args.newVolunteerId);
    if (!newVolunteer) {
      throw new Error("Target assignee user not found");
    }
    if (newVolunteer.verificationStatus === "suspended" || newVolunteer.verificationStatus === "rejected") {
      throw new Error("Target assignee is suspended or rejected");
    }
    if (newVolunteer.role === "volunteer" && newVolunteer.verificationStatus !== "approved") {
      throw new Error("Target volunteer is not verified or approved");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company lead not found");
    }

    const now = Date.now();

    // Mark previous active assignment as reassigned
    const existingActive = await ctx.db
      .query("leadAssignments")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    for (const assignment of existingActive) {
      await ctx.db.patch(assignment._id, {
        status: "reassigned",
        reassignReason: args.reassignReason.trim(),
        updatedAt: now,
      });
    }

    // Insert new active assignment
    await ctx.db.insert("leadAssignments", {
      companyId: args.companyId,
      volunteerId: args.newVolunteerId,
      assignedBy: admin._id,
      status: "active",
      assignedAt: now,
      updatedAt: now,
    });

    // Ensure company status is at least ASSIGNED
    if (company.leadStatus === "UNASSIGNED") {
      await ctx.db.patch(args.companyId, {
        leadStatus: "ASSIGNED",
        updatedAt: now,
      });
    }

    // Audit log
    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "lead_reassigned",
      entityType: "companies",
      entityId: args.companyId,
      changes: JSON.stringify({
        companyName: company.companyName,
        reassignedTo: newVolunteer.name,
        newVolunteerId: newVolunteer._id,
        reason: args.reassignReason.trim(),
        reassignedAt: now,
      }),
      timestamp: now,
    });

    return {
      success: true,
      newVolunteerName: newVolunteer.name,
    };
  },
});

/**
 * Admin action: Remove assignment and return lead to UNASSIGNED pool
 */
export const unassignLead = mutation({
  args: {
    adminClerkId: v.string(),
    companyId: v.id("companies"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can unassign leads");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company lead not found");
    }

    const now = Date.now();

    // Mark all active assignments for this company as unassigned
    const activeAssignments = await ctx.db
      .query("leadAssignments")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    for (const a of activeAssignments) {
      await ctx.db.patch(a._id, {
        status: "released",
        updatedAt: now,
      });
    }

    // Revert company lead status to UNASSIGNED if it was ASSIGNED
    if (company.leadStatus === "ASSIGNED") {
      await ctx.db.patch(args.companyId, {
        leadStatus: "UNASSIGNED",
        updatedAt: now,
      });
    }

    // Audit log
    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "lead_unassigned",
      entityType: "companies",
      entityId: args.companyId,
      changes: JSON.stringify({
        companyName: company.companyName,
        reason: args.reason || "Unassigned by Admin",
        unassignedAt: now,
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Volunteer query: Strictly get leads assigned to the authenticated volunteer
 * INVARIANT: Isolated strictly to authenticated user; unapproved returns empty
 */
export const getMyAssignedLeads = query({
  args: {
    volunteerClerkId: v.string(),
    tab: v.optional(v.string()),
    priority: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.volunteerClerkId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.volunteerClerkId))
      .unique();

    // Boundary: Approved volunteers or active admins can query their assigned leads
    if (!user || user.verificationStatus === "suspended" || user.verificationStatus === "rejected") {
      return [];
    }
    if (user.role === "volunteer" && user.verificationStatus !== "approved") {
      return [];
    }

    // Fetch active assignments for this volunteer
    const assignments = await ctx.db
      .query("leadAssignments")
      .withIndex("by_volunteer_and_status", (q) =>
        q.eq("volunteerId", user._id).eq("status", "active")
      )
      .order("desc")
      .collect();

    // Fetch company records and primary contacts
    const assignedLeads = await Promise.all(
      assignments.map(async (assignment) => {
        const company = await ctx.db.get(assignment.companyId);
        if (!company) return null;

        const contacts = await ctx.db
          .query("contacts")
          .withIndex("by_company_id", (q) => q.eq("companyId", company._id))
          .collect();

        const primaryContact =
          contacts.find((ct) => ct.isPrimary) || contacts[0] || null;

        return {
          ...company,
          primaryContact,
          totalContacts: contacts.length,
          assignmentId: assignment._id,
          assignedAt: assignment.assignedAt,
        };
      })
    );

    let filtered = assignedLeads.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

    // Filter by tab
    if (args.tab && args.tab !== "all") {
      if (args.tab === "to_contact") {
        filtered = filtered.filter((l) => l.leadStatus === "ASSIGNED");
      } else if (args.tab === "in_progress") {
        filtered = filtered.filter((l) =>
          ["CONTACTED", "FOLLOW_UP", "PROPOSAL_REQUESTED", "PROPOSAL_SENT", "NEGOTIATION"].includes(
            l.leadStatus
          )
        );
      } else if (args.tab === "follow_up") {
        filtered = filtered.filter((l) => l.leadStatus === "FOLLOW_UP");
      } else if (args.tab === "interested") {
        filtered = filtered.filter((l) =>
          ["INTERESTED", "PROPOSAL_REQUESTED", "PROPOSAL_SENT", "NEGOTIATION", "WON"].includes(
            l.leadStatus
          )
        );
      }
    }

    // Filter by priority
    if (args.priority && args.priority !== "all") {
      filtered = filtered.filter((l) => l.priority === args.priority);
    }

    // Filter by search
    if (args.search && args.search.trim().length > 0) {
      const q = args.search.toLowerCase().trim();
      filtered = filtered.filter(
        (l) =>
          l.companyName.toLowerCase().includes(q) ||
          l.industry.toLowerCase().includes(q) ||
          l.niche.toLowerCase().includes(q) ||
          (l.primaryContact &&
            (l.primaryContact.contactName.toLowerCase().includes(q) ||
              l.primaryContact.phone.includes(q) ||
              l.primaryContact.designation.toLowerCase().includes(q)))
      );
    }

    return filtered;
  },
});

/**
 * Volunteer query: Live workstation metrics for Today's Work command bar
 */
export const getMyWorkstationMetrics = query({
  args: {
    volunteerClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.volunteerClerkId) {
      return {
        totalAssigned: 0,
        toContact: 0,
        highPriority: 0,
        callsCompleted: 0,
        dailyTarget: 15,
        callsRemaining: 15,
        overdueFollowUps: 0,
        todayFollowUps: 0,
        interestedCount: 0,
        inProgressCount: 0,
      };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.volunteerClerkId))
      .unique();

    if (!user || user.verificationStatus === "suspended" || user.verificationStatus === "rejected") {
      return {
        totalAssigned: 0,
        toContact: 0,
        highPriority: 0,
        callsCompleted: 0,
        dailyTarget: 15,
        callsRemaining: 15,
        overdueFollowUps: 0,
        todayFollowUps: 0,
        interestedCount: 0,
        inProgressCount: 0,
      };
    }
    if (user.role === "volunteer" && user.verificationStatus !== "approved") {
      return {
        totalAssigned: 0,
        toContact: 0,
        highPriority: 0,
        callsCompleted: 0,
        dailyTarget: 15,
        callsRemaining: 15,
        overdueFollowUps: 0,
        todayFollowUps: 0,
        interestedCount: 0,
        inProgressCount: 0,
      };
    }

    const assignments = await ctx.db
      .query("leadAssignments")
      .withIndex("by_volunteer_and_status", (q) =>
        q.eq("volunteerId", user._id).eq("status", "active")
      )
      .collect();

    const companies = await Promise.all(
      assignments.map((a) => ctx.db.get(a.companyId))
    );

    const validCompanies = companies.filter((c): c is NonNullable<typeof c> => c !== null);

    const totalAssigned = validCompanies.length;
    const toContact = validCompanies.filter((c) => c.leadStatus === "ASSIGNED").length;
    const highPriority = validCompanies.filter((c) => c.priority === "High").length;
    const interestedCount = validCompanies.filter((c) =>
      ["INTERESTED", "PROPOSAL_REQUESTED", "PROPOSAL_SENT", "NEGOTIATION", "WON"].includes(
        c.leadStatus
      )
    ).length;
    const inProgressCount = validCompanies.filter((c) =>
      ["CONTACTED", "FOLLOW_UP", "PROPOSAL_REQUESTED", "PROPOSAL_SENT", "NEGOTIATION"].includes(
        c.leadStatus
      )
    ).length;

    // Daily call quota calculation (Target = 15)
    const now = Date.now();
    const today = new Date(now);
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000;

    // Daily calls completed today
    const callsToday = await ctx.db
      .query("calls")
      .withIndex("by_volunteer_id", (q) => q.eq("volunteerId", user._id))
      .filter((q) => q.gte(q.field("startedAt"), startOfToday))
      .collect();

    const callsCompleted = callsToday.length;
    const dailyTarget = 15;
    const callsRemaining = Math.max(0, dailyTarget - callsCompleted);

    // Follow-ups pending
    const pendingFollowUps = await ctx.db
      .query("followUps")
      .withIndex("by_volunteer_and_status", (q) =>
        q.eq("volunteerId", user._id).eq("status", "pending")
      )
      .collect();

    const overdueFollowUps = pendingFollowUps.filter(
      (f) => f.dueDate < startOfToday
    ).length;
    const todayFollowUps = pendingFollowUps.filter(
      (f) => f.dueDate >= startOfToday && f.dueDate < endOfToday
    ).length;

    return {
      totalAssigned,
      toContact,
      highPriority,
      callsCompleted,
      dailyTarget,
      callsRemaining,
      overdueFollowUps,
      todayFollowUps,
      interestedCount,
      inProgressCount,
    };
  },

});

/**
 * Get assignment history for a company lead
 */
export const getCompanyAssignmentHistory = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("leadAssignments")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();

    return await Promise.all(
      assignments.map(async (a) => {
        const volunteer = await ctx.db.get(a.volunteerId);
        const assigner = await ctx.db.get(a.assignedBy);

        return {
          ...a,
          volunteerName: volunteer?.name || "Unknown Volunteer",
          volunteerEmail: volunteer?.email || "",
          volunteerDepartment: volunteer?.department || "",
          assignedByName: assigner?.name || "Admin",
        };
      })
    );
  },
});
