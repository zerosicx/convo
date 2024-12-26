import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    _id: v.id("users"),
    username: v.string(),
    password: v.string(),
  }),

  notebooks: defineTable({
    _id: v.id("notebooks"),
    name: v.string(),
    user: v.id("users"),
    description: v.string(),
    colour: v.string(),
    sections: v.array(v.id("sections")),
  }).index("by_user", ["user"]),

  sections: defineTable({
    _id: v.id("sections"),
    name: v.string(),
    user: v.id("users"),
    notebookId: v.id("notebooks"),
    color: v.string(),
  }).index("by_user", ["user"]),

  pages: defineTable({
    _id: v.id("pages"),
    user: v.id("users"),
    sectionId: v.id("sections"),
    parentPageId: v.optional(v.id("pages")),
    title: v.string(),
    data: v.array(v.any()),
    path: v.string(),
    level: v.number(),
    tags: v.array(v.string()),
    archived: v.boolean(),
  })
    .index("by_user", ["user"])
    .index("by_section", ["sectionId"]),
});
