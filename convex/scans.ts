import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const scanStudent = mutation({
  args: { studentId: v.string() },
  handler: async (ctx: any, args: any) => {
    // 1. Store scan record
    await ctx.db.insert("scans", {
      studentId: args.studentId,
      scanTime: Date.now(),
    });

    // 2. Return student data if exists
    return await ctx.db
      .query("users")
      .withIndex("by_studentId", (q: any) => q.eq("studentId", args.studentId))
      .first();
  },
});
