import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUserId } from "./utils/auth";

/**
 * Get all pages for the authenticated user
 */
export const getAllPages = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .collect();
    return pages;
  },
});

/**
 * Get a page by its client-generated ID (only if owned by authenticated user)
 */
export const getPageByClientId = query({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const page = await ctx.db
      .query("pages")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    // Verify ownership
    if (page && page.user !== userId) {
      return null;
    }
    return page;
  },
});

/**
 * Create a new page for the authenticated user
 */
export const createPage = mutation({
  args: {
    clientId: v.string(),
    sectionId: v.optional(v.string()),
    title: v.string(),
    parentPageId: v.optional(v.string()),
    data: v.optional(v.any()),
    path: v.string(),
    level: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const now = Date.now();

    const newPage = {
      clientId: args.clientId,
      user: userId,
      sectionId: args.sectionId,
      parentPageId: args.parentPageId,
      title: args.title,
      data: args.data ?? "",
      path: args.path,
      level: args.level,
      tags: [],
      archived: false,
      creationDate: now,
      editedDate: now,
    };

    const id = await ctx.db.insert("pages", newPage);
    return { ...newPage, _id: id };
  },
});

/**
 * Update a page by its client-generated ID (only if owned by authenticated user)
 */
export const updatePageByClientId = mutation({
  args: {
    clientId: v.string(),
    data: v.object({
      title: v.optional(v.string()),
      data: v.optional(v.any()),
      parentPageId: v.optional(v.string()),
      path: v.optional(v.string()),
      level: v.optional(v.number()),
      archived: v.optional(v.boolean()),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const page = await ctx.db
      .query("pages")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    if (!page) {
      throw new Error(`Page with clientId ${args.clientId} not found`);
    }

    // Verify ownership
    if (page.user !== userId) {
      throw new Error("Not authorized to update this page");
    }

    await ctx.db.patch(page._id, {
      ...args.data,
      editedDate: Date.now(),
    });
  },
});

/**
 * Delete a page and all its children by client ID (only if owned by authenticated user)
 */
export const deletePageByClientId = mutation({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const page = await ctx.db
      .query("pages")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    if (!page) {
      return; // Already deleted or doesn't exist
    }

    // Verify ownership
    if (page.user !== userId) {
      throw new Error("Not authorized to delete this page");
    }

    // Recursively delete all child pages
    const children = await ctx.db
      .query("pages")
      .withIndex("by_parentPage", (q) => q.eq("parentPageId", args.clientId))
      .collect();

    for (const child of children) {
      // Recursive call via internal helper (ownership already verified at top level)
      await deletePageRecursive(ctx, child.clientId, userId);
    }

    await ctx.db.delete(page._id);
  },
});

/**
 * Internal helper to recursively delete pages (assumes ownership verified)
 */
async function deletePageRecursive(
  ctx: { db: any },
  clientId: string,
  userId: string
): Promise<void> {
  const page = await ctx.db
    .query("pages")
    .withIndex("by_clientId", (q: any) => q.eq("clientId", clientId))
    .unique();

  if (!page || page.user !== userId) return;

  // Get and delete children first
  const children = await ctx.db
    .query("pages")
    .withIndex("by_parentPage", (q: any) => q.eq("parentPageId", clientId))
    .collect();

  for (const child of children) {
    await deletePageRecursive(ctx, child.clientId, userId);
  }

  await ctx.db.delete(page._id);
}

/**
 * Archive a page and all its children (only if owned by authenticated user)
 */
export const archivePageByClientId = mutation({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const page = await ctx.db
      .query("pages")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    if (!page) {
      throw new Error(`Page with clientId ${args.clientId} not found`);
    }

    if (page.user !== userId) {
      throw new Error("Not authorized to archive this page");
    }

    await archivePageRecursive(ctx, args.clientId, true, userId);
  },
});

/**
 * Unarchive a page and all its parents (only if owned by authenticated user)
 */
export const unarchivePageByClientId = mutation({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const page = await ctx.db
      .query("pages")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .unique();

    if (!page) {
      throw new Error(`Page with clientId ${args.clientId} not found`);
    }

    if (page.user !== userId) {
      throw new Error("Not authorized to unarchive this page");
    }

    await ctx.db.patch(page._id, {
      archived: false,
      editedDate: Date.now(),
    });

    // Unarchive all parent pages to ensure this page is visible
    if (page.parentPageId) {
      await unarchiveParentsRecursive(ctx, page.parentPageId, userId);
    }
  },
});

/**
 * Internal helper to recursively archive/unarchive pages (assumes ownership verified)
 */
async function archivePageRecursive(
  ctx: { db: any },
  clientId: string,
  archived: boolean,
  userId: string
): Promise<void> {
  const page = await ctx.db
    .query("pages")
    .withIndex("by_clientId", (q: any) => q.eq("clientId", clientId))
    .unique();

  if (!page || page.user !== userId) return;

  await ctx.db.patch(page._id, {
    archived,
    editedDate: Date.now(),
  });

  // Archive all children
  const children = await ctx.db
    .query("pages")
    .withIndex("by_parentPage", (q: any) => q.eq("parentPageId", clientId))
    .collect();

  for (const child of children) {
    await archivePageRecursive(ctx, child.clientId, archived, userId);
  }
}

/**
 * Internal helper to unarchive parent pages recursively (assumes ownership verified)
 */
async function unarchiveParentsRecursive(
  ctx: { db: any },
  clientId: string,
  userId: string
): Promise<void> {
  const page = await ctx.db
    .query("pages")
    .withIndex("by_clientId", (q: any) => q.eq("clientId", clientId))
    .unique();

  if (!page || page.user !== userId) return;

  if (page.archived) {
    await ctx.db.patch(page._id, {
      archived: false,
      editedDate: Date.now(),
    });
  }

  if (page.parentPageId) {
    await unarchiveParentsRecursive(ctx, page.parentPageId, userId);
  }
}

/**
 * Delete all pages in a section (only if owned by authenticated user)
 */
export const deleteBySection = mutation({
  args: { sectionId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    for (const page of pages) {
      // Only delete pages owned by authenticated user
      if (page.user === userId) {
        await ctx.db.delete(page._id);
      }
    }
  },
});

/**
 * Bulk upsert pages (for sync from local storage)
 * Only syncs pages owned by the authenticated user
 */
export const upsertPages = mutation({
  args: {
    pages: v.array(
      v.object({
        clientId: v.string(),
        sectionId: v.optional(v.string()),
        parentPageId: v.optional(v.string()),
        title: v.string(),
        data: v.any(),
        path: v.string(),
        level: v.number(),
        tags: v.array(v.string()),
        archived: v.boolean(),
        creationDate: v.number(),
        editedDate: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    for (const pageData of args.pages) {
      const existing = await ctx.db
        .query("pages")
        .withIndex("by_clientId", (q) => q.eq("clientId", pageData.clientId))
        .unique();

      if (existing) {
        // Verify ownership before updating
        if (existing.user !== userId) {
          console.warn(`Skipping page ${pageData.clientId} - not owned by user`);
          continue;
        }
        // Update if local version is newer
        if (pageData.editedDate > existing.editedDate) {
          await ctx.db.patch(existing._id, pageData);
        }
      } else {
        // Insert new page with authenticated user as owner
        await ctx.db.insert("pages", { ...pageData, user: userId });
      }
    }
  },
});
