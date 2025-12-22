import { NotebookId, PageId, SectionId } from "./definitions";
import { notebooks, pages, sections } from "./dummyData";

export const getCurrentNotebook = (notebookId: NotebookId) => {
  return notebooks.find((n) => n._id === notebookId);
};

export const getCurrentSection = (sectionId: SectionId) => {
  return sections.find((s) => s._id === sectionId);
};

export const getCurrentPage = (pageId: PageId) => {
  return pages.find((p) => p._id === pageId);
};
