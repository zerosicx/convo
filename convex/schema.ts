import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schema for offline-first note-taking app.
 * Using string IDs for client-generated UUIDs to support offline creation.
 * Convex auto-generates `_id` on insert; we use `clientId` for local references.
 */
export default defineSchema({
  users: defineTable({
    clientId: v.string(), // Client-generated UUID
    username: v.string(),
    password: v.string(),
  }).index("by_clientId", ["clientId"]),

  notebooks: defineTable({
    clientId: v.string(), // Client-generated UUID
    name: v.string(),
    user: v.string(), // References users.clientId
    description: v.string(),
    colour: v.string(),
    sections: v.array(v.string()), // Array of section clientIds
  })
    .index("by_user", ["user"])
    .index("by_clientId", ["clientId"]),

  sections: defineTable({
    clientId: v.string(), // Client-generated UUID
    name: v.string(),
    user: v.string(), // References users.clientId
    notebookId: v.string(), // References notebooks.clientId
    color: v.string(),
  })
    .index("by_user", ["user"])
    .index("by_notebook", ["notebookId"])
    .index("by_clientId", ["clientId"]),

  pages: defineTable({
    clientId: v.string(), // Client-generated UUID
    user: v.string(), // References users.clientId
    sectionId: v.optional(v.string()), // References sections.clientId (nullable for inbox)
    parentPageId: v.optional(v.string()), // References pages.clientId
    title: v.string(),
    data: v.any(), // BlockNote JSON content
    path: v.string(),
    level: v.number(),
    tags: v.array(v.string()),
    archived: v.boolean(),
    creationDate: v.number(), // Unix timestamp
    editedDate: v.number(), // Unix timestamp
  })
    .index("by_user", ["user"])
    .index("by_section", ["sectionId"])
    .index("by_parentPage", ["parentPageId"])
    .index("by_clientId", ["clientId"]),
});
