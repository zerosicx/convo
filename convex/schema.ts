import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    id: v.string(),
    username: v.string(),
    email: v.string(),
  }),

  notebooks: defineTable({
    id: v.string(),
    name: v.string(),
    user: v.id("users"),
    description: v.string(),
    colour: v.string(),
    sections: v.array(v.id("sections")),
  }),

  sections: defineTable({
    id: v.string(),
    name: v.string(),
    user: v.id("users"),
    notebookId: v.id("notebooks"),
    color: v.string(),
  }),

  pages: defineTable({
    id: v.string(),
    sectionId: v.id("sections"),
    parentPageId: v.optional(v.id("pages")),
    title: v.string(),
    data: v.array(v.any()),
    path: v.string(),
    level: v.number(),
    tags: v.array(v.string()),
    archived: v.boolean(),
  }),
});
