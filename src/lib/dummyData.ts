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
  },
  {
    id: "page-002",
    sectionId: "section-001",
    parentPageId: "page-001",
    title: "Graph Algorithms",
    data: "BFS, DFS, Dijkstra's, and Floyd-Warshall explained.",
    path: "notebook-001/section-001/page-001/page-002",
    level: 1,
  },
  {
    id: "page-003",
    sectionId: "section-002",
    parentPageId: null,
    title: "Linear Algebra Notes",
    data: "Topics include vectors, matrices, and linear transformations.",
    path: "notebook-001/section-002/page-003",
    level: 0,
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
  },
  {
    id: "page-005",
    sectionId: "section-005",
    parentPageId: null,
    title: "Book Recommendations",
    data: "Top recommended reads for self-growth and career advancement.",
    path: "notebook-002/section-005/page-005",
    level: 0,
  },
  {
    id: "page-006",
    sectionId: "section-006",
    parentPageId: null,
    title: "Programming Courses",
    data: "List of online courses to improve coding skills.",
    path: "notebook-002/section-006/page-006",
    level: 0,
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
  },
  {
    id: "page-008",
    sectionId: "section-008",
    parentPageId: null,
    title: "Common Interview Questions",
    data: "Behavioral, technical, and HR interview preparation.",
    path: "notebook-003/section-008/page-008",
    level: 0,
  },
  {
    id: "page-009",
    sectionId: "section-009",
    parentPageId: null,
    title: "Project Showcase",
    data: "Portfolio projects highlighting your skills and achievements.",
    path: "notebook-003/section-009/page-009",
    level: 0,
  },
];
