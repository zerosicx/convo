import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUserId } from "./utils/auth";

/**
 * Get all sections for the authenticated user
 */
export const getAllSections = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .collect();
    return sections;
  },
});

/**
 * Get sections by notebook (only if owned by authenticated user)
 */
export const getSectionsByNotebook = query({
  args: { notebookId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_notebook", (q) => q.eq("notebookId", args.notebookId))
      .collect();

    // Filter to only return sections owned by authenticated user
    return sections.filter((s) => s.user === userId);
  },
});

/**
 * Get a section by its client-generated ID (only if owned by authenticated user)
 */
export const getSectionByClientId = query({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const section = await ctx.db
      .query("sections")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    // Verify ownership
    if (section && section.user !== userId) {
      return null;
    }
    return section;
  },
});

/**
 * Create a new section for the authenticated user
 */
export const createSection = mutation({
  args: {
    clientId: v.string(),
    name: v.string(),
    notebookId: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const newSection = {
      clientId: args.clientId,
      name: args.name,
      user: userId,
      notebookId: args.notebookId,
      color: args.color,
    };

    const id = await ctx.db.insert("sections", newSection);
    return { ...newSection, _id: id };
  },
});

/**
 * Update a section by its client-generated ID (only if owned by authenticated user)
 */
export const updateSectionByClientId = mutation({
  args: {
    clientId: v.string(),
    data: v.object({
      name: v.optional(v.string()),
      color: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const section = await ctx.db
      .query("sections")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    if (!section) {
      throw new Error(`Section with clientId ${args.clientId} not found`);
    }

    // Verify ownership
    if (section.user !== userId) {
      throw new Error("Not authorized to update this section");
    }

    await ctx.db.patch(section._id, args.data);
  },
});

/**
 * Delete a section by its client-generated ID (only if owned by authenticated user)
 */
export const deleteSectionByClientId = mutation({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const section = await ctx.db
      .query("sections")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    if (!section) {
      return; // Already deleted or doesn't exist
    }

    // Verify ownership
    if (section.user !== userId) {
      throw new Error("Not authorized to delete this section");
    }

    await ctx.db.delete(section._id);
  },
});

/**
 * Bulk upsert sections (for sync from local storage)
 * Only syncs sections owned by the authenticated user
 */
export const upsertSections = mutation({
  args: {
    sections: v.array(
      v.object({
        clientId: v.string(),
        name: v.string(),
        notebookId: v.string(),
        color: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    for (const sectionData of args.sections) {
      const existing = await ctx.db
        .query("sections")
        .withIndex("by_clientId", (q) => q.eq("clientId", sectionData.clientId))
        .unique();

      if (existing) {
        // Verify ownership before updating
        if (existing.user !== userId) {
          console.warn(`Skipping section ${sectionData.clientId} - not owned by user`);
          continue;
        }
        await ctx.db.patch(existing._id, sectionData);
      } else {
        // Create new section with authenticated user as owner
        await ctx.db.insert("sections", { ...sectionData, user: userId });
      }
    }
  },
});
