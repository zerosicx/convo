# Convo: A simple note taking app built for web.

If OneNote and Notion had a baby.

┌─────────────────────────────────────────────────────────────┐
│                         User                                │
├─────────────────────────────────────────────────────────────┤
│                      React Components                       │
│            (Navigator, PageTree, NotePage, etc.)            │
├─────────────────────────────────────────────────────────────┤
│                     Zustand Stores                          │
│   (page-store, notebook-store, section-store)               │
│   └── Persisted to localStorage via zustand/persist         │
├─────────────────────────────────────────────────────────────┤
│                      Sync Service                           │
│   └── useSync() hook in App.tsx                             │
│   └── Fetches from Convex on load                           │
│   └── Pushes changes periodically / on online               │
├─────────────────────────────────────────────────────────────┤
│                    Convex Backend                           │
│   └── clientId-based lookups (not Convex _id)               │
│   └── upsert mutations for sync                             │
└─────────────────────────────────────────────────────────────┘