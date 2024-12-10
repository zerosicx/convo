import { getCurrentNotebook, getCurrentPage, getCurrentSection } from "@/lib/controller";
import { useRef, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { Input } from "./Input";

const NoteMeta = () => {

    const [editing, setEditing] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const params = useParams();
    const pageId = params.pageId;

    const currentPage = getCurrentPage(pageId as string);

    if (!params.pageId || !currentPage) redirect('/app');

    const [sectionName, notebookName] = (() => {
        const pathComponents = currentPage?.path.split("/");

        let sectionName, notebookName = undefined;

        if (pathComponents && pathComponents.length >= 3) {
            sectionName = getCurrentSection(pathComponents[1])?.name;
            notebookName = getCurrentNotebook(pathComponents[0])?.name;
        }

        return [sectionName, notebookName]
    })();

    const handleTitleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setEditing(true);
    }

    const handleKeydownEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputRef.current) {
            inputRef.current.blur();
            setEditing(false);
        }
    }

    return (
        <div className="flex flex-col w-full h-32 items-start p-3">
            <section>
                <p className="text-sm">
                    {
                        `${notebookName} / ${sectionName} / ${currentPage?.title}`
                    }
                </p>
            </section>
            <main className="pt-8 px-6">
                {
                    !editing && <h1 className="text-4xl" onClick={handleTitleClick}>{currentPage?.title}</h1>
                }
                {
                    editing && <Input autoFocus ref={inputRef} placeholder={currentPage?.title} onKeyDown={handleKeydownEnter} variant="title" onBlur={() => setEditing(false)} />
                }
            </main>
        </div>
    )
}

export default NoteMeta