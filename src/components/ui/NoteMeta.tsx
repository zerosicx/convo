import { toast } from "@/hooks/use-toast";
import { useNotebookStore } from "@/lib/stores/notebook-store";
import { usePageStore } from "@/lib/stores/page-store";
import { useSectionStore } from "@/lib/stores/section-store";
import { useRef, useState } from "react";
import { NavLink, redirect, useLocation, useParams } from "react-router-dom";
import { Input } from "./Input";

const NoteMeta = () => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getPageById, updatePageById } = usePageStore();
  const { getSectionById } = useSectionStore();
  const { getNotebookById } = useNotebookStore();
  const location = useLocation();
  const { pageId } = useParams();
  const isInbox = location.pathname.includes("/inbox");

  const currentPage = getPageById(pageId || "");
  if (!pageId || !currentPage) redirect("/app");

  const pathComponents = currentPage?.path.split("/") || [];
  const section =
    pathComponents[1] && !isInbox ? getSectionById(pathComponents[1]) : null;
  const notebook =
    pathComponents[0] && !isInbox ? getNotebookById(pathComponents[0]) : null;
  const pagePath = pathComponents.slice(isInbox ? 0 : 2).map(getPageById);

  const handleTitleClick = () => setEditing(true);

  const handleKeydownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
      setEditing(false);
      toast({ description: "Successfully updated page name 🎉" });
    }
  };

  const handleChange = () => {
    updatePageById(currentPage?.id ?? "", {
      title: inputRef.current?.value || currentPage?.title,
    });
  };

  return (
    <div className="flex flex-col w-full h-full items-start p-3">
      <section>
        <p className="text-sm text-zinc-800">
          {notebook && (
            <NavLink
              to={`notebook/${notebook.id}`}
              className="hover:text-brand hover:font-medium"
            >
              {notebook.name} /
            </NavLink>
          )}
          <NavLink
            to={
              section
                ? `notebook/${notebook?.id}/section/${section.id}`
                : `inbox`
            }
            className="hover:text-brand hover:font-medium"
          >
            {section?.name ? ` ${section?.name} ` : "Inbox "}
          </NavLink>
          {pagePath.map((page, index) => (
            <NavLink
              to={
                notebook && section
                  ? `notebook/${notebook.id}/section/${section.id}/page/${page?.id}`
                  : `inbox/page/${page?.id}`
              }
              key={index}
              className="hover:text-brand hover:font-medium"
            >
              {` / ${page?.title}`}
            </NavLink>
          ))}
        </p>
      </section>
      <main className="pt-8 px-6 w-full h-full">
        {!editing ? (
          <h1 className="text-4xl" onClick={handleTitleClick}>
            {currentPage?.title}
          </h1>
        ) : (
          <Input
            autoFocus
            value={currentPage?.title}
            ref={inputRef}
            placeholder={currentPage?.title}
            onKeyDown={handleKeydownEnter}
            variant="title"
            onBlur={() => setEditing(false)}
            onChange={handleChange}
            style={{
              width: "100%",
              whiteSpace: "break-spaces",
            }}
          />
        )}
      </main>
    </div>
  );
};

export default NoteMeta;
