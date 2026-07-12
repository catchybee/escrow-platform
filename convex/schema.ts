import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // This line creates the necessary tables for authentication:
  ...authTables,
  
  // Your projects table:
  projects: defineTable({
    title: v.string(),
    freelancerEmail: v.string(),
    totalBudget: v.number(),
    milestones: v.array(v.object({
      description: v.string(),
      amount: v.number(),
    }))
  }),
});