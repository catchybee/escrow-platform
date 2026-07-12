import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    freelancerEmail: v.string(),
    totalBudget: v.number(),
    milestones: v.array(v.object({
      description: v.string(),
      amount: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // We are inserting strictly what the base schema allows to bypass the error completely.
    return await ctx.db.insert("projects", {
      title: args.title,
      freelancerEmail: args.freelancerEmail,
      totalBudget: args.totalBudget,
      milestones: args.milestones,
    });
  },
});