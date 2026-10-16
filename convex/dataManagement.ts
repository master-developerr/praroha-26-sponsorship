import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Server-Side Security Gate:
 * Strictly verifies that the calling user is an approved admin.
 * Throws descriptive errors if unauthorized or unverified.
 */
async function assertAdminUser(ctx: any, adminClerkId: string): Promise<Doc<"users">> {
  if (!adminClerkId || adminClerkId.trim() === "") {
    throw new Error("UNAUTHORIZED: Missing admin authentication credentials.");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", adminClerkId))
    .first();

  if (!user) {
    throw new Error("UNAUTHORIZED: Admin user account not found in database.");
  }

  if (user.role !== "admin") {
    throw new Error("FORBIDDEN: You do not have permission to execute administrative destructive operations. Role required: admin.");
  }

  if (user.verificationStatus !== "approved") {
    throw new Error("FORBIDDEN: Administrative privileges require an approved verification status.");
  }

  return user;
}

/**
 * Query real-time data counts and calculate exact affected record impacts
 * for each destructive operation.
 */
export const getSystemDataCounts = query({
  args: {
    adminClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdminUser(ctx, args.adminClerkId);

    const companies = await ctx.db.query("companies").collect();
    const contacts = await ctx.db.query("contacts").collect();
    const users = await ctx.db.query("users").collect();
    const assignments = await ctx.db.query("leadAssignments").collect();
    const calls = await ctx.db.query("calls").collect();
    const callDebriefs = await ctx.db.query("callDebriefs").collect();
    const followUps = await ctx.db.query("followUps").collect();
    const proposals = await ctx.db.query("proposals").collect();
    const commitments = await ctx.db.query("sponsorshipCommitments").collect();
    const pointTransactions = await ctx.db.query("pointTransactions").collect();
    const notifications = await ctx.db.query("notifications").collect();
    const aiAnalyses = await ctx.db.query("aiAnalyses").collect();
    const auditLogs = await ctx.db.query("auditLogs").collect();

    const students = users.filter((u) => u.role === "volunteer");
    const admins = users.filter((u) => u.role === "admin");
    const activeCompanies = companies.filter((c) => !c.isArchived);
    const archivedCompanies = companies.filter((c) => c.isArchived);

    // Exact calculations of affected records for each confirmation modal
    const leadsImpact = {
      companies: companies.length,
      contacts: contacts.length,
      leadAssignments: assignments.length,
      followUps: followUps.length,
      calls: calls.length,
      callDebriefs: callDebriefs.length,
      proposals: proposals.length,
      commitments: commitments.length,
      aiAnalyses: aiAnalyses.length,
      total:
        companies.length +
        contacts.length +
        assignments.length +
        followUps.length +
        calls.length +
        callDebriefs.length +
        proposals.length +
        commitments.length +
        aiAnalyses.length,
    };

    const studentIds = new Set(students.map((s) => s._id));
    const studentAssignments = assignments.filter((a) => studentIds.has(a.volunteerId));
    const studentPoints = pointTransactions.filter((p) => studentIds.has(p.userId));
    const studentNotifications = notifications.filter((n) => studentIds.has(n.userId));
    const studentCalls = calls.filter((c) => studentIds.has(c.volunteerId));
    const studentDebriefs = callDebriefs.filter((d) => studentIds.has(d.volunteerId));
    const studentFollowUps = followUps.filter((f) => studentIds.has(f.volunteerId));

    const studentsImpact = {
      students: students.length,
      leadAssignments: studentAssignments.length,
      pointTransactions: studentPoints.length,
      notifications: studentNotifications.length,
      calls: studentCalls.length,
      callDebriefs: studentDebriefs.length,
      followUps: studentFollowUps.length,
      total:
        students.length +
        studentAssignments.length +
        studentPoints.length +
        studentNotifications.length +
        studentCalls.length +
        studentDebriefs.length +
        studentFollowUps.length,
    };

    const outreachImpact = {
      calls: calls.length,
      callDebriefs: callDebriefs.length,
      followUps: followUps.length,
      proposals: proposals.length,
      leadAssignments: assignments.length,
      pointTransactions: pointTransactions.length,
      aiAnalyses: aiAnalyses.length,
      total:
        calls.length +
        callDebriefs.length +
        followUps.length +
        proposals.length +
        assignments.length +
        pointTransactions.length +
        aiAnalyses.length,
    };

    const resetEventImpact = {
      companies: companies.length,
      contacts: contacts.length,
      calls: calls.length,
      callDebriefs: callDebriefs.length,
      followUps: followUps.length,
      proposals: proposals.length,
      commitments: commitments.length,
      leadAssignments: assignments.length,
      pointTransactions: pointTransactions.length,
      aiAnalyses: aiAnalyses.length,
      notifications: notifications.length,
      total:
        companies.length +
        contacts.length +
        calls.length +
        callDebriefs.length +
        followUps.length +
        proposals.length +
        commitments.length +
        assignments.length +
        pointTransactions.length +
        aiAnalyses.length +
        notifications.length,
    };

    const factoryResetImpact = {
      otherUsers: users.length > 1 ? users.length - 1 : 0,
      companies: companies.length,
      contacts: contacts.length,
      calls: calls.length,
      callDebriefs: callDebriefs.length,
      followUps: followUps.length,
      proposals: proposals.length,
      commitments: commitments.length,
      leadAssignments: assignments.length,
      pointTransactions: pointTransactions.length,
      aiAnalyses: aiAnalyses.length,
      notifications: notifications.length,
      total:
        (users.length > 1 ? users.length - 1 : 0) +
        companies.length +
        contacts.length +
        calls.length +
        callDebriefs.length +
        followUps.length +
        proposals.length +
        commitments.length +
        assignments.length +
        pointTransactions.length +
        aiAnalyses.length +
        notifications.length,
    };

    return {
      rawCounts: {
        companies: companies.length,
        activeCompanies: activeCompanies.length,
        archivedCompanies: archivedCompanies.length,
        contacts: contacts.length,
        students: students.length,
        admins: admins.length,
        assignments: assignments.length,
        calls: calls.length,
        callDebriefs: callDebriefs.length,
        followUps: followUps.length,
        proposals: proposals.length,
        commitments: commitments.length,
        pointTransactions: pointTransactions.length,
        notifications: notifications.length,
        aiAnalyses: aiAnalyses.length,
        auditLogs: auditLogs.length,
      },
      impacts: {
        leadsImpact,
        studentsImpact,
        outreachImpact,
        resetEventImpact,
        factoryResetImpact,
      },
    };
  },
});

/**
 * Query recent destructive operations for forensic auditing on the Data Management page.
 */
export const getRecentDestructiveOperations = query({
  args: {
    adminClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdminUser(ctx, args.adminClerkId);

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(100);

    const dataLogs = logs.filter((l) => l.action.startsWith("data:"));
    const users = await ctx.db.query("users").collect();
    const userMap = new Map();
    users.forEach((u) => {
      userMap.set(u._id, u);
      userMap.set(u.clerkId, u);
    });

    return dataLogs.map((l) => {
      const actor = userMap.get(l.actorId);
      let details: any = {};
      try {
        details = JSON.parse(l.changes);
      } catch {
        details = { raw: l.changes };
      }

      return {
        _id: l._id,
        timestamp: l.timestamp,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        actorId: l.actorId,
        actorName: actor?.name || details.adminName || "System Admin",
        actorEmail: actor?.email || details.adminEmail || "internal@praroha.in",
        status: details.status || "SUCCESS",
        deletedCounts: details.deletedCounts || {},
        notes: details.notes || "",
      };
    });
  },
});

/**
 * DESTRUCTIVE ACTION 1: DELETE ALL LEADS
 * Permanently deletes all company and contact records, plus all cascading dependent data.
 */
export const deleteAllLeads = mutation({
  args: {
    adminClerkId: v.string(),
    confirmationPhrase: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.confirmationPhrase.trim() !== "DELETE ALL LEADS") {
      throw new Error('INVALID_CONFIRMATION: Exact phrase required: "DELETE ALL LEADS"');
    }

    const admin = await assertAdminUser(ctx, args.adminClerkId);
    const now = Date.now();

    // 1. Collect all dependent entities
    const companies = await ctx.db.query("companies").collect();
    const contacts = await ctx.db.query("contacts").collect();
    const assignments = await ctx.db.query("leadAssignments").collect();
    const followUps = await ctx.db.query("followUps").collect();
    const calls = await ctx.db.query("calls").collect();
    const callDebriefs = await ctx.db.query("callDebriefs").collect();
    const proposals = await ctx.db.query("proposals").collect();
    const commitments = await ctx.db.query("sponsorshipCommitments").collect();
    const aiAnalyses = await ctx.db.query("aiAnalyses").collect();
    const allNotifications = await ctx.db.query("notifications").collect();

    const leadNotifications = allNotifications.filter(
      (n) =>
        n.type === "lead_assigned" ||
        n.type === "lead_reassigned" ||
        n.type === "follow_up_due" ||
        n.type === "deal_won"
    );

    // 2. Perform cascading deletion
    for (const c of companies) await ctx.db.delete(c._id);
    for (const ct of contacts) await ctx.db.delete(ct._id);
    for (const a of assignments) await ctx.db.delete(a._id);
    for (const f of followUps) await ctx.db.delete(f._id);
    for (const cl of calls) await ctx.db.delete(cl._id);
    for (const cd of callDebriefs) await ctx.db.delete(cd._id);
    for (const p of proposals) await ctx.db.delete(p._id);
    for (const cm of commitments) await ctx.db.delete(cm._id);
    for (const ai of aiAnalyses) await ctx.db.delete(ai._id);
    for (const n of leadNotifications) await ctx.db.delete(n._id);

    const deletedCounts = {
      companies: companies.length,
      contacts: contacts.length,
      leadAssignments: assignments.length,
      followUps: followUps.length,
      calls: calls.length,
      callDebriefs: callDebriefs.length,
      proposals: proposals.length,
      commitments: commitments.length,
      aiAnalyses: aiAnalyses.length,
      notifications: leadNotifications.length,
      total:
        companies.length +
        contacts.length +
        assignments.length +
        followUps.length +
        calls.length +
        callDebriefs.length +
        proposals.length +
        commitments.length +
        aiAnalyses.length +
        leadNotifications.length,
    };

    // 3. Log immutable audit trail
    await ctx.db.insert("auditLogs", {
      actorId: admin.clerkId,
      action: "data:delete_all_leads",
      entityType: "system",
      entityId: "all_leads_cascade",
      changes: JSON.stringify({
        operation: "DELETE ALL LEADS",
        adminEmail: admin.email,
        adminName: admin.name,
        deletedCounts,
        status: "SUCCESS",
        timestamp: now,
      }),
      timestamp: now,
    });

    return {
      success: true,
      message: `Permanently deleted ${companies.length} corporate leads and ${deletedCounts.total} dependent records.`,
      deletedCounts,
    };
  },
});

/**
 * DESTRUCTIVE ACTION 2: DELETE ALL STUDENTS / VOLUNTEERS
 * Permanently removes all student/volunteer user records and their exclusive dependent data.
 */
export const deleteAllStudents = mutation({
  args: {
    adminClerkId: v.string(),
    confirmationPhrase: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.confirmationPhrase.trim() !== "DELETE ALL STUDENTS") {
      throw new Error('INVALID_CONFIRMATION: Exact phrase required: "DELETE ALL STUDENTS"');
    }

    const admin = await assertAdminUser(ctx, args.adminClerkId);
    const now = Date.now();

    // 1. Collect all student volunteers (preserve admins)
    const allUsers = await ctx.db.query("users").collect();
    const students = allUsers.filter((u) => u.role !== "admin");
    const studentIds = new Set(students.map((s) => s._id));

    // 2. Collect and clean up volunteer-exclusive dependent records
    const assignments = await ctx.db.query("leadAssignments").collect();
    const studentAssignments = assignments.filter((a) => studentIds.has(a.volunteerId));
    for (const a of studentAssignments) await ctx.db.delete(a._id);

    const pointTransactions = await ctx.db.query("pointTransactions").collect();
    const studentPoints = pointTransactions.filter((p) => studentIds.has(p.userId));
    for (const pt of studentPoints) await ctx.db.delete(pt._id);

    const notifications = await ctx.db.query("notifications").collect();
    const studentNotifications = notifications.filter((n) => studentIds.has(n.userId));
    for (const n of studentNotifications) await ctx.db.delete(n._id);

    const calls = await ctx.db.query("calls").collect();
    const studentCalls = calls.filter((c) => studentIds.has(c.volunteerId));
    for (const c of studentCalls) await ctx.db.delete(c._id);

    const callDebriefs = await ctx.db.query("callDebriefs").collect();
    const studentDebriefs = callDebriefs.filter((d) => studentIds.has(d.volunteerId));
    for (const d of studentDebriefs) await ctx.db.delete(d._id);

    const followUps = await ctx.db.query("followUps").collect();
    const studentFollowUps = followUps.filter((f) => studentIds.has(f.volunteerId));
    for (const f of studentFollowUps) await ctx.db.delete(f._id);

    // 3. Reset company lead status if it was assigned to a deleted volunteer
    const companies = await ctx.db.query("companies").collect();
    let companiesUnassignedCount = 0;
    for (const comp of companies) {
      if (comp.leadStatus === "ASSIGNED") {
        await ctx.db.patch(comp._id, {
          leadStatus: "UNASSIGNED",
          updatedAt: now,
        });
        companiesUnassignedCount++;
      }
    }

    // 4. Delete the student volunteer user records
    for (const s of students) {
      await ctx.db.delete(s._id);
    }

    const deletedCounts = {
      students: students.length,
      leadAssignments: studentAssignments.length,
      pointTransactions: studentPoints.length,
      notifications: studentNotifications.length,
      calls: studentCalls.length,
      callDebriefs: studentDebriefs.length,
      followUps: studentFollowUps.length,
      companiesUnassigned: companiesUnassignedCount,
      total:
        students.length +
        studentAssignments.length +
        studentPoints.length +
        studentNotifications.length +
        studentCalls.length +
        studentDebriefs.length +
        studentFollowUps.length,
    };

    // 5. Log immutable audit trail
    await ctx.db.insert("auditLogs", {
      actorId: admin.clerkId,
      action: "data:delete_all_students",
      entityType: "system",
      entityId: "all_students_cascade",
      changes: JSON.stringify({
        operation: "DELETE ALL STUDENTS",
        adminEmail: admin.email,
        adminName: admin.name,
        deletedCounts,
        status: "SUCCESS",
        timestamp: now,
      }),
      timestamp: now,
    });

    return {
      success: true,
      message: `Permanently deleted ${students.length} student SDR accounts and ${deletedCounts.total} dependent records.`,
      deletedCounts,
    };
  },
});

/**
 * DESTRUCTIVE ACTION 3: DELETE ALL OUTREACH DATA
 * Clears operational calls, debriefs, follow-ups, proposals, allocations, and points.
 * Preserves user accounts, companies, contacts, and festival configuration.
 */
export const deleteAllOutreach = mutation({
  args: {
    adminClerkId: v.string(),
    confirmationPhrase: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.confirmationPhrase.trim() !== "DELETE ALL OUTREACH") {
      throw new Error('INVALID_CONFIRMATION: Exact phrase required: "DELETE ALL OUTREACH"');
    }

    const admin = await assertAdminUser(ctx, args.adminClerkId);
    const now = Date.now();

    // 1. Delete calls & debriefs
    const calls = await ctx.db.query("calls").collect();
    for (const c of calls) await ctx.db.delete(c._id);

    const callDebriefs = await ctx.db.query("callDebriefs").collect();
    for (const d of callDebriefs) await ctx.db.delete(d._id);

    // 2. Delete follow-ups
    const followUps = await ctx.db.query("followUps").collect();
    for (const f of followUps) await ctx.db.delete(f._id);

    // 3. Delete proposals
    const proposals = await ctx.db.query("proposals").collect();
    for (const p of proposals) await ctx.db.delete(p._id);

    // 4. Delete lead assignments
    const assignments = await ctx.db.query("leadAssignments").collect();
    for (const a of assignments) await ctx.db.delete(a._id);

    // 5. Delete point transactions
    const pointTransactions = await ctx.db.query("pointTransactions").collect();
    for (const pt of pointTransactions) await ctx.db.delete(pt._id);

    // 6. Delete AI analyses
    const aiAnalyses = await ctx.db.query("aiAnalyses").collect();
    for (const ai of aiAnalyses) await ctx.db.delete(ai._id);

    // 7. Delete outreach notifications
    const notifications = await ctx.db.query("notifications").collect();
    const outreachNotifications = notifications.filter(
      (n) =>
        n.type === "lead_assigned" ||
        n.type === "lead_reassigned" ||
        n.type === "follow_up_due" ||
        n.type === "deal_won"
    );
    for (const n of outreachNotifications) await ctx.db.delete(n._id);

    // 8. Reset company lead status back to UNASSIGNED
    const companies = await ctx.db.query("companies").collect();
    for (const comp of companies) {
      if (comp.leadStatus !== "UNASSIGNED" && !comp.isArchived) {
        await ctx.db.patch(comp._id, {
          leadStatus: "UNASSIGNED",
          lastContactedAt: undefined,
          updatedAt: now,
        });
      }
    }

    // 9. Reset user total points to 0
    const users = await ctx.db.query("users").collect();
    for (const u of users) {
      if (u.totalPoints && u.totalPoints > 0) {
        await ctx.db.patch(u._id, { totalPoints: 0, updatedAt: now });
      }
    }

    const deletedCounts = {
      calls: calls.length,
      callDebriefs: callDebriefs.length,
      followUps: followUps.length,
      proposals: proposals.length,
      leadAssignments: assignments.length,
      pointTransactions: pointTransactions.length,
      aiAnalyses: aiAnalyses.length,
      notifications: outreachNotifications.length,
      companiesReset: companies.length,
      total:
        calls.length +
        callDebriefs.length +
        followUps.length +
        proposals.length +
        assignments.length +
        pointTransactions.length +
        aiAnalyses.length +
        outreachNotifications.length,
    };

    // 10. Log immutable audit trail
    await ctx.db.insert("auditLogs", {
      actorId: admin.clerkId,
      action: "data:delete_all_outreach",
      entityType: "system",
      entityId: "outreach_pipeline_reset",
      changes: JSON.stringify({
        operation: "DELETE ALL OUTREACH",
        adminEmail: admin.email,
        adminName: admin.name,
        deletedCounts,
        status: "SUCCESS",
        timestamp: now,
      }),
      timestamp: now,
    });

    return {
      success: true,
      message: `Successfully cleared all outreach activity (${deletedCounts.total} records). Leads reset to UNASSIGNED.`,
      deletedCounts,
    };
  },
});

/**
 * DESTRUCTIVE ACTION 4: RESET EVENT DATA
 * Deletes all operational event data (leads, contacts, calls, commitments, proposals, etc.)
 * Preserves all admin and volunteer accounts, and event configuration.
 */
export const resetEventData = mutation({
  args: {
    adminClerkId: v.string(),
    confirmationPhrase: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.confirmationPhrase.trim() !== "RESET EVENT DATA") {
      throw new Error('INVALID_CONFIRMATION: Exact phrase required: "RESET EVENT DATA"');
    }

    const admin = await assertAdminUser(ctx, args.adminClerkId);
    const now = Date.now();

    // 1. Delete all operational entities
    const companies = await ctx.db.query("companies").collect();
    for (const c of companies) await ctx.db.delete(c._id);

    const contacts = await ctx.db.query("contacts").collect();
    for (const ct of contacts) await ctx.db.delete(ct._id);

    const assignments = await ctx.db.query("leadAssignments").collect();
    for (const a of assignments) await ctx.db.delete(a._id);

    const calls = await ctx.db.query("calls").collect();
    for (const c of calls) await ctx.db.delete(c._id);

    const callDebriefs = await ctx.db.query("callDebriefs").collect();
    for (const d of callDebriefs) await ctx.db.delete(d._id);

    const followUps = await ctx.db.query("followUps").collect();
    for (const f of followUps) await ctx.db.delete(f._id);

    const proposals = await ctx.db.query("proposals").collect();
    for (const p of proposals) await ctx.db.delete(p._id);

    const commitments = await ctx.db.query("sponsorshipCommitments").collect();
    for (const cm of commitments) await ctx.db.delete(cm._id);

    const aiAnalyses = await ctx.db.query("aiAnalyses").collect();
    for (const ai of aiAnalyses) await ctx.db.delete(ai._id);

    const pointTransactions = await ctx.db.query("pointTransactions").collect();
    for (const pt of pointTransactions) await ctx.db.delete(pt._id);

    const notifications = await ctx.db.query("notifications").collect();
    for (const n of notifications) await ctx.db.delete(n._id);

    // 2. Reset user total points to 0 (preserves all accounts)
    const users = await ctx.db.query("users").collect();
    for (const u of users) {
      if (u.totalPoints !== 0) {
        await ctx.db.patch(u._id, { totalPoints: 0, updatedAt: now });
      }
    }

    const deletedCounts = {
      companies: companies.length,
      contacts: contacts.length,
      leadAssignments: assignments.length,
      calls: calls.length,
      callDebriefs: callDebriefs.length,
      followUps: followUps.length,
      proposals: proposals.length,
      commitments: commitments.length,
      aiAnalyses: aiAnalyses.length,
      pointTransactions: pointTransactions.length,
      notifications: notifications.length,
      usersPreserved: users.length,
      total:
        companies.length +
        contacts.length +
        assignments.length +
        calls.length +
        callDebriefs.length +
        followUps.length +
        proposals.length +
        commitments.length +
        aiAnalyses.length +
        pointTransactions.length +
        notifications.length,
    };

    // 3. Log immutable audit trail
    await ctx.db.insert("auditLogs", {
      actorId: admin.clerkId,
      action: "data:reset_event_data",
      entityType: "system",
      entityId: "event_data_reset",
      changes: JSON.stringify({
        operation: "RESET EVENT DATA",
        adminEmail: admin.email,
        adminName: admin.name,
        deletedCounts,
        usersPreserved: users.length,
        status: "SUCCESS",
        timestamp: now,
      }),
      timestamp: now,
    });

    return {
      success: true,
      message: `Reset complete. Deleted ${deletedCounts.total} operational records. Preserved ${users.length} user accounts.`,
      deletedCounts,
    };
  },
});

/**
 * DESTRUCTIVE ACTION 5: FACTORY RESET
 * Extreme operation: Resets database to clean production state.
 * Preserves ONLY the calling primary admin account and core configuration.
 */
export const factoryReset = mutation({
  args: {
    adminClerkId: v.string(),
    confirmationPhrase: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.confirmationPhrase.trim() !== "FACTORY RESET PRAROHA26") {
      throw new Error('INVALID_CONFIRMATION: Exact phrase required: "FACTORY RESET PRAROHA26"');
    }

    const admin = await assertAdminUser(ctx, args.adminClerkId);
    const now = Date.now();

    // 1. Delete all other users (preserve only calling admin)
    const users = await ctx.db.query("users").collect();
    let otherUsersDeleted = 0;
    for (const u of users) {
      if (u._id !== admin._id) {
        await ctx.db.delete(u._id);
        otherUsersDeleted++;
      }
    }

    // Reset calling admin totalPoints to 0
    await ctx.db.patch(admin._id, { totalPoints: 0, updatedAt: now });

    // 2. Delete all companies & contacts
    const companies = await ctx.db.query("companies").collect();
    for (const c of companies) await ctx.db.delete(c._id);

    const contacts = await ctx.db.query("contacts").collect();
    for (const ct of contacts) await ctx.db.delete(ct._id);

    // 3. Delete all operational data
    const assignments = await ctx.db.query("leadAssignments").collect();
    for (const a of assignments) await ctx.db.delete(a._id);

    const calls = await ctx.db.query("calls").collect();
    for (const c of calls) await ctx.db.delete(c._id);

    const callDebriefs = await ctx.db.query("callDebriefs").collect();
    for (const d of callDebriefs) await ctx.db.delete(d._id);

    const followUps = await ctx.db.query("followUps").collect();
    for (const f of followUps) await ctx.db.delete(f._id);

    const proposals = await ctx.db.query("proposals").collect();
    for (const p of proposals) await ctx.db.delete(p._id);

    const commitments = await ctx.db.query("sponsorshipCommitments").collect();
    for (const cm of commitments) await ctx.db.delete(cm._id);

    const aiAnalyses = await ctx.db.query("aiAnalyses").collect();
    for (const ai of aiAnalyses) await ctx.db.delete(ai._id);

    const pointTransactions = await ctx.db.query("pointTransactions").collect();
    for (const pt of pointTransactions) await ctx.db.delete(pt._id);

    const notifications = await ctx.db.query("notifications").collect();
    for (const n of notifications) await ctx.db.delete(n._id);

    const deletedCounts = {
      otherUsers: otherUsersDeleted,
      companies: companies.length,
      contacts: contacts.length,
      leadAssignments: assignments.length,
      calls: calls.length,
      callDebriefs: callDebriefs.length,
      followUps: followUps.length,
      proposals: proposals.length,
      commitments: commitments.length,
      aiAnalyses: aiAnalyses.length,
      pointTransactions: pointTransactions.length,
      notifications: notifications.length,
      total:
        otherUsersDeleted +
        companies.length +
        contacts.length +
        assignments.length +
        calls.length +
        callDebriefs.length +
        followUps.length +
        proposals.length +
        commitments.length +
        aiAnalyses.length +
        pointTransactions.length +
        notifications.length,
    };

    // 4. Log immutable audit trail
    await ctx.db.insert("auditLogs", {
      actorId: admin.clerkId,
      action: "data:factory_reset",
      entityType: "system",
      entityId: "factory_reset_root",
      changes: JSON.stringify({
        operation: "FACTORY RESET PRAROHA26",
        preservedAdmin: {
          clerkId: admin.clerkId,
          email: admin.email,
          name: admin.name,
        },
        deletedCounts,
        status: "SUCCESS",
        timestamp: now,
      }),
      timestamp: now,
    });

    return {
      success: true,
      message: `Factory reset complete. Deleted ${deletedCounts.total} records. Primary admin account preserved.`,
      deletedCounts,
    };
  },
});
