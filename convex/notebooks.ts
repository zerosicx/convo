import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllNotebooks = query({
  args: { user: v.id("users") },
  handler: async (ctx, args) => {
    const notebooks = await ctx.db
      .query("notebooks")
      .withIndex("by_user", (q) => q.eq("user", args.user))
      .collect();

    return notebooks;
  },
});

export const createNotebook = mutation({
  args: {
    name: v.string(),
    user: v.id("users"),
    description: v.optional(v.string()),
    colour: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newNotebook = {
      name: args.name,
      user: args.user,
      description: args.description || "",
      colour: args.colour || "#1e40af",
      sections: [],
    };
    const notebook = await ctx.db.insert("notebooks", newNotebook);
    return notebook;
  },
});

export const updateNotebook = mutation({
  args: {
    id: v.id("notebooks"),
    data: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      colour: v.optional(v.string()),
      sections: v.optional(v.array(v.id("sections"))),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});

export const deleteNotebook = mutation({
  args: { id: v.id("notebooks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getNotebookById = query({
  args: { id: v.id("notebooks") },
  handler: async (ctx, args) => {
    const notebook = await ctx.db.get(args.id);
    return notebook;
  },
});
