import { v } from "convex/values";
import uuid4 from "uuid4";
import { mutation, query } from "./_generated/server";

export const getAllPages = query({
  args: { user: v.id("users") },
  handler: async (ctx, args) => {
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_user", (q) => q.eq("user", args.user));
    return pages;
  },
});

export const getPageById = query({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.id);
    return page;
  },
});

export const createPage = mutation({
  args: {
    user: v.id("users"),
    sectionId: v.id("sections"),
    title: v.string(),
    parentPageId: v.optional(v.id("pages")),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const id = uuid4();
    const parentPage = args.parentPageId
      ? await ctx.db.get(args.parentPageId)
      : null;

    const newPage = {
      _id: id,
      sectionId: args.sectionId,
      title: args.title,
      data: args.data || "",
      parentPageId: parentPage?._id || undefined,
      path: parentPage ? `${parentPage.path}/${id}` : id,
      level: parentPage ? parentPage.level + 1 : 0,
      archived: false,
      user: args.user,
      tags: [],
    };
    await ctx.db.insert("pages", newPage);
    return newPage;
  },
});

export const updatePageById = mutation({
  args: {
    id: v.id("pages"),
    data: v.object({
      title: v.optional(v.string()),
      data: v.optional(v.any()),
      parentPageId: v.optional(v.id("pages")),
      path: v.optional(v.string()),
      level: v.optional(v.number()),
      archived: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ...args.data,
    });
  },
});

export const deletePage = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const archivePage = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      archived: true,
    });

    // TODO: archive all pages underneath it
  },
});

// TODO: unarchive a page and all its parents

/**
 * Utility Functions
 */

export const deleteBySection = mutation({
  args: {
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    // Get the pages that need to be deleted
    const toDelete = await ctx.db
      .query("pages")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    // Delete the pages. Their children being deleted should be handled within the delete api.
    toDelete.map((page) => deletePage(ctx, { id: page._id }));
  },
});
