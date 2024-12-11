import { toast } from "@/hooks/use-toast";
import { useNotebookStore } from "@/lib/stores/notebook-store";
import { usePageStore } from "@/lib/stores/page-store";
import { useSectionStore } from "@/lib/stores/section-store";
import { useRef, useState } from "react";
import { NavLink, redirect, useParams } from "react-router-dom";
import { Input } from "./Input";

const NoteMeta = () => {

    const [editing, setEditing] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { getPageById, updatePageById } = usePageStore();
    const { getSectionById } = useSectionStore();
    const { getNotebookById } = useNotebookStore()

    const params = useParams();
    const pageId = params.pageId;

    const currentPage = getPageById(pageId as string);

    if (!params.pageId || !currentPage) redirect('/app');

    const [sectionName, notebookName, pagePath] = (() => {
        const pathComponents = currentPage?.path.split("/");

        let sectionName, notebookName, pagePath = undefined;


        if (pathComponents && pathComponents.length >= 3) {
            sectionName = getSectionById(pathComponents[1])?.name;
            notebookName = getNotebookById(pathComponents[0])?.name;
            pagePath = pathComponents.slice(2).map((pId) => {
                return getPageById(pId)
            });

        }

        return [sectionName, notebookName, pagePath]
    })();

    const handleTitleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setEditing(true);
    }

    const handleKeydownEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputRef.current) {
            inputRef.current.blur();
            setEditing(false);
            toast({
                description: "Successfully updated page name 🎉"
            })
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updatePageById(currentPage?.id as string, {
            title: inputRef?.current?.value ?? currentPage?.title
        })
    }

    return (
        <div className="flex flex-col w-full h-32 items-start p-3">
            <section>
                <p className="text-sm text-muted-foreground">
                    {
                        `${notebookName} / ${sectionName} `
                    }
                    {
                        pagePath?.map((page) => {
                            return <NavLink to={`notebook/${params?.notebookId}/section/${params?.sectionId}/page/${page?.id}`}>
                                <span className="text-muted-foreground hover:text-indigo-500 hover:font-medium">/ {page?.title} </span>
                            </NavLink>
                        })
                    }
                </p>
            </section>
            <main className="pt-8 px-6">
                {
                    !editing && <h1 className="text-4xl" onClick={handleTitleClick}>{currentPage?.title}</h1>
                }
                {
                    editing && <Input autoFocus value={currentPage?.title} ref={inputRef} placeholder={currentPage?.title} onKeyDown={handleKeydownEnter} variant="title" onBlur={() => setEditing(false)} onChange={handleChange} />
                }
            </main>
        </div>
    )
}

export default NoteMeta