import { v } from "convex/values";
import uuid4 from "uuid4";
import { mutation, query } from "./_generated/server";

export const getAllSections = query({
  args: { user: v.id("users") },
  handler: async (ctx, args) => {
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_user", (q) => q.eq("user", args.user));
    return sections;
  },
});

export const createSection = mutation({
  args: {
    name: v.string(),
    user: v.id("users"),
    notebookId: v.id("notebooks"),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const id = uuid4();
    const newSection = {
      _id: id,
      name: args.name,
      user: args.user,
      notebookId: args.notebookId,
      color: args.color,
    };
    await ctx.db.insert("sections", newSection);
    return newSection;
  },
});

export const updateSectionById = mutation({
  args: {
    id: v.id("sections"),
    data: v.object({
      name: v.optional(v.string()),
      color: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});

export const deleteSection = mutation({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getSectionById = query({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    return section;
  },
});
