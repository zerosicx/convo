import { Notebook, Page, Section } from "./definitions";

const userId = "user-001";

// Notebooks
export const notebooks: Notebook[] = [
  {
    id: "notebook-001",
    name: "University Courses",
    user: userId,
    description: "Organise coursework and assignments by course.",
    colour: "#4285F4", // Google Blue
    sections: ["section-001", "section-002", "section-003"],
  },
  {
    id: "notebook-002",
    name: "Personal Development Plan",
    user: userId,
    description: "Track goals, habits, and personal projects.",
    colour: "#34A853", // Google Green
    sections: ["section-004", "section-005", "section-006"],
  },
  {
    id: "notebook-003",
    name: "Career Planning",
    user: userId,
    description: "Prepare for job applications and interviews.",
    colour: "#FABB05", // Google Yellow
    sections: ["section-007", "section-008", "section-009"],
  },
];

// Sections
export const sections: Section[] = [
  // University Courses Sections
  {
    id: "section-001",
    name: "Computer Science",
    user: userId,
    notebookId: "notebook-001",
    color: "#1E90FF", // Dodger Blue
  },
  {
    id: "section-002",
    name: "Mathematics",
    user: userId,
    notebookId: "notebook-001",
    color: "#8A2BE2", // Blue Violet
  },
  {
    id: "section-003",
    name: "Physics",
    user: userId,
    notebookId: "notebook-001",
    color: "#FF6347", // Tomato Red
  },

  // Personal Development Sections
  {
    id: "section-004",
    name: "Habit Tracker",
    user: userId,
    notebookId: "notebook-002",
    color: "#32CD32", // Lime Green
  },
  {
    id: "section-005",
    name: "Reading List",
    user: userId,
    notebookId: "notebook-002",
    color: "#FFD700", // Gold
  },
  {
    id: "section-006",
    name: "Skill Development",
    user: userId,
    notebookId: "notebook-002",
    color: "#FF4500", // Orange Red
  },

  // Career Planning Sections
  {
    id: "section-007",
    name: "Resume Building",
    user: userId,
    notebookId: "notebook-003",
    color: "#FFA500", // Orange
  },
  {
    id: "section-008",
    name: "Interview Prep",
    user: userId,
    notebookId: "notebook-003",
    color: "#20B2AA", // Light Sea Green
  },
  {
    id: "section-009",
    name: "Portfolio Projects",
    user: userId,
    notebookId: "notebook-003",
    color: "#6A5ACD", // Slate Blue
  },
];

// Pages
export const pages: Page[] = [
  // Computer Science Pages
  {
    id: "page-001",
    sectionId: "section-001",
    parentPageId: null,
    title: "Data Structures Notes",
    data: "Covering arrays, linked lists, trees, and graphs.",
    path: "notebook-001/section-001/page-001",
    level: 0,
    creationDate: new Date("2024-01-01T09:00:00Z"),
    editedDate: new Date("2024-01-10T15:30:00Z"),
    archived: false,
  },
  {
    id: "page-002",
    sectionId: "section-001",
    parentPageId: "page-001",
    title: "Graph Algorithms",
    data: "BFS, DFS, Dijkstra's, and Floyd-Warshall explained.",
    path: "notebook-001/section-001/page-001/page-002",
    level: 1,
    creationDate: new Date("2024-01-05T12:00:00Z"),
    editedDate: new Date("2024-01-12T16:00:00Z"),
    archived: false,
  },
  {
    id: "page-010",
    sectionId: "section-001",
    parentPageId: "page-002",
    title: "Depth-First Search Details",
    data: "DFS implementation and example use cases.",
    path: "notebook-001/section-001/page-001/page-002/page-010",
    level: 2,
    creationDate: new Date("2024-01-08T14:30:00Z"),
    editedDate: new Date("2024-01-15T10:45:00Z"),
    archived: false,
  },
  {
    id: "page-011",
    sectionId: "section-001",
    parentPageId: "page-002",
    title: "Breadth-First Search Details",
    data: "BFS implementation and example use cases.",
    path: "notebook-001/section-001/page-001/page-002/page-011",
    level: 2,
    creationDate: new Date("2024-01-09T11:20:00Z"),
    editedDate: new Date("2024-01-16T14:00:00Z"),
    archived: false,
  },
  {
    id: "page-003",
    sectionId: "section-002",
    parentPageId: null,
    title: "Linear Algebra Notes",
    data: "Topics include vectors, matrices, and linear transformations.",
    path: "notebook-001/section-002/page-003",
    level: 0,
    creationDate: new Date("2024-01-03T08:15:00Z"),
    editedDate: new Date("2024-01-13T13:45:00Z"),
    archived: false,
  },
  {
    id: "page-012",
    sectionId: "section-002",
    parentPageId: "page-003",
    title: "Matrix Operations",
    data: "Addition, multiplication, inversion, and determinant calculation.",
    path: "notebook-001/section-002/page-003/page-012",
    level: 1,
    creationDate: new Date("2024-01-07T10:50:00Z"),
    editedDate: new Date("2024-01-17T09:30:00Z"),
    archived: false,
  },

  // Personal Development Pages
  {
    id: "page-004",
    sectionId: "section-004",
    parentPageId: null,
    title: "Daily Routine Tracker",
    data: "Morning routines, exercise schedules, and productivity habits.",
    path: "notebook-002/section-004/page-004",
    level: 0,
    creationDate: new Date("2024-01-04T07:45:00Z"),
    editedDate: new Date("2024-01-11T14:20:00Z"),
    archived: false,
  },
  {
    id: "page-013",
    sectionId: "section-004",
    parentPageId: "page-004",
    title: "Morning Routines",
    data: "Tips for starting your day productively.",
    path: "notebook-002/section-004/page-004/page-013",
    level: 1,
    creationDate: new Date("2024-01-06T09:10:00Z"),
    editedDate: new Date("2024-01-14T12:40:00Z"),
    archived: false,
  },
  {
    id: "page-005",
    sectionId: "section-005",
    parentPageId: null,
    title: "Book Recommendations",
    data: "Top recommended reads for self-growth and career advancement.",
    path: "notebook-002/section-005/page-005",
    level: 0,
    creationDate: new Date("2024-01-02T13:30:00Z"),
    editedDate: new Date("2024-01-18T11:25:00Z"),
    archived: false,
  },
  {
    id: "page-014",
    sectionId: "section-005",
    parentPageId: "page-005",
    title: "Career Development Books",
    data: "Essential books for skill building and leadership.",
    path: "notebook-002/section-005/page-005/page-014",
    level: 1,
    creationDate: new Date("2024-01-10T10:00:00Z"),
    editedDate: new Date("2024-01-19T09:15:00Z"),
    archived: false,
  },

  // Career Planning Pages
  {
    id: "page-007",
    sectionId: "section-007",
    parentPageId: null,
    title: "Resume Template",
    data: "Best templates for modern and professional resumes.",
    path: "notebook-003/section-007/page-007",
    level: 0,
    creationDate: new Date("2024-01-01T09:00:00Z"),
    editedDate: new Date("2024-01-20T14:50:00Z"),
    archived: false,
  },
  {
    id: "page-015",
    sectionId: "section-007",
    parentPageId: "page-007",
    title: "Technical Resume Tips",
    data: "How to showcase technical skills effectively.",
    path: "notebook-003/section-007/page-007/page-015",
    level: 1,
    creationDate: new Date("2024-01-08T11:30:00Z"),
    editedDate: new Date("2024-01-21T10:25:00Z"),
    archived: false,
  },
  {
    id: "page-008",
    sectionId: "section-008",
    parentPageId: null,
    title: "Common Interview Questions",
    data: "Behavioral, technical, and HR interview preparation.",
    path: "notebook-003/section-008/page-008",
    level: 0,
    creationDate: new Date("2024-01-04T13:40:00Z"),
    editedDate: new Date("2024-01-22T16:30:00Z"),
    archived: false,
  },
  {
    id: "page-016",
    sectionId: "section-008",
    parentPageId: "page-008",
    title: "Behavioral Questions",
    data: "Sample answers for common behavioral interview questions.",
    path: "notebook-003/section-008/page-008/page-016",
    level: 1,
    creationDate: new Date("2024-01-09T14:20:00Z"),
    editedDate: new Date("2024-01-23T17:15:00Z"),
    archived: false,
  },
  {
    id: "page-009",
    sectionId: "section-009",
    parentPageId: null,
    title: "Project Showcase",
    data: "Portfolio projects highlighting your skills and achievements.",
    path: "notebook-003/section-009/page-009",
    level: 0,
    creationDate: new Date("2024-01-05T15:30:00Z"),
    editedDate: new Date("2024-01-24T18:00:00Z"),
    archived: false,
  },
];
