import { action } from "./_generated/server";
import { v } from "convex/values";

// 1. THIS PREPARES A 25% PHASE DEPOSIT
export const fundPhase = action({
  args: { projectId: v.id("projects"), totalBudget: v.number() },
  handler: async (_ctx, args) => {
    // Import dynamically ONLY when the function runs
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-06-24.dahlia",
    });

    const phaseAmount = Math.floor(args.totalBudget * 0.25); 
    const paymentIntent = await stripe.paymentIntents.create({
      amount: phaseAmount,
      currency: "usd",
      metadata: { projectId: args.projectId }, 
    });

    return { clientSecret: paymentIntent.client_secret };
  },
});

// 2. THIS RELEASES THE FUNDS AT THE END
export const releaseAllFunds = action({
  args: { amountToRelease: v.number(), freelancerAccountId: v.string() },
  handler: async (ctx, args) => {
    // Import dynamically ONLY when the function runs
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-06-24.dahlia",
    });

    const transfer = await stripe.transfers.create({
      amount: args.amountToRelease,
      currency: "usd",
      destination: args.freelancerAccountId,
    });
    return transfer.id;
  },
});