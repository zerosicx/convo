import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUserId } from "./utils/auth";

/**
 * Get all notebooks for the authenticated user
 */
export const getAllNotebooks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);
    const notebooks = await ctx.db
      .query("notebooks")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .collect();
    return notebooks;
  },
});

/**
 * Get a notebook by its client-generated ID (only if owned by authenticated user)
 */
export const getNotebookByClientId = query({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const notebook = await ctx.db
      .query("notebooks")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    // Verify ownership
    if (notebook && notebook.user !== userId) {
      return null;
    }
    return notebook;
  },
});

/**
 * Create a new notebook for the authenticated user
 */
export const createNotebook = mutation({
  args: {
    clientId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    colour: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const newNotebook = {
      clientId: args.clientId,
      name: args.name,
      user: userId,
      description: args.description ?? "",
      colour: args.colour ?? "#1e40af",
      sections: [],
    };

    const id = await ctx.db.insert("notebooks", newNotebook);
    return { ...newNotebook, _id: id };
  },
});

/**
 * Update a notebook by its client-generated ID (only if owned by authenticated user)
 */
export const updateNotebookByClientId = mutation({
  args: {
    clientId: v.string(),
    data: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      colour: v.optional(v.string()),
      sections: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const notebook = await ctx.db
      .query("notebooks")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    if (!notebook) {
      throw new Error(`Notebook with clientId ${args.clientId} not found`);
    }

    // Verify ownership
    if (notebook.user !== userId) {
      throw new Error("Not authorized to update this notebook");
    }

    await ctx.db.patch(notebook._id, args.data);
  },
});

/**
 * Delete a notebook by its client-generated ID (only if owned by authenticated user)
 */
export const deleteNotebookByClientId = mutation({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const notebook = await ctx.db
      .query("notebooks")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    if (!notebook) {
      return; // Already deleted or doesn't exist
    }

    // Verify ownership
    if (notebook.user !== userId) {
      throw new Error("Not authorized to delete this notebook");
    }

    await ctx.db.delete(notebook._id);
  },
});

/**
 * Bulk upsert notebooks (for sync from local storage)
 * Only syncs notebooks owned by the authenticated user
 */
export const upsertNotebooks = mutation({
  args: {
    notebooks: v.array(
      v.object({
        clientId: v.string(),
        name: v.string(),
        description: v.string(),
        colour: v.string(),
        sections: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    for (const notebookData of args.notebooks) {
      const existing = await ctx.db
        .query("notebooks")
        .withIndex("by_clientId", (q) => q.eq("clientId", notebookData.clientId))
        .unique();

      if (existing) {
        // Verify ownership before updating
        if (existing.user !== userId) {
          console.warn(`Skipping notebook ${notebookData.clientId} - not owned by user`);
          continue;
        }
        await ctx.db.patch(existing._id, notebookData);
      } else {
        // Create new notebook with authenticated user as owner
        await ctx.db.insert("notebooks", { ...notebookData, user: userId });
      }
    }
  },
});
