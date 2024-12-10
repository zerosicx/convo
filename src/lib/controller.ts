import { NotebookId, PageId, SectionId } from "./definitions";
import { notebooks, pages, sections } from "./dummyData";

export const getCurrentNotebook = (notebookId: NotebookId) => {
  return notebooks.find((n) => n.id === notebookId);
};

export const getCurrentSection = (sectionId: SectionId) => {
  return sections.find((s) => s.id === sectionId);
};

export const getCurrentPage = (pageId: PageId) => {
  return pages.find((p) => p.id === pageId);
};
