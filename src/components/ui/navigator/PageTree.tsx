import { Page } from "@/lib/definitions";
import { usePageStore } from "@/lib/stores/page-store";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, FileIcon } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button } from "../Button";
import { Input } from "../Input";

export const PageTree = ({ sectionId }: { sectionId: string }) => {

    const { pages } = usePageStore();

    const getTopLevelPagesFromSection = () => {
        return Object.values(pages).filter((p) => p.level === 0 && p.sectionId === sectionId);
    }

    return (
        <div>
            {
                getTopLevelPagesFromSection().map((page, index) => {
                    return (
                        <PageItem currentPage={page} key={index} />
                    )
                })
            }
        </div>
    )
}

export const PageItem = ({ currentPage }: {
    currentPage: Page
}) => {
    const [open, setOpen] = useState<boolean>(false);
    // Get all the pages under the current level
    const params = useParams();
    const sectionId = params.sectionId;
    const { pages } = usePageStore();
    const [creatingPage, setCreatingPage] = useState(false);
    const pageInputRef = useRef<ElementRef<"input">>(null);
    const { createPage } = usePageStore();


    // Use regex to match the notebook id; temporary while UUID4 is not implemented
    const getNotebookId = (path: string) => {
        // TODO: use this regex expression when UUID is implemented
        return path.split("/")[0];
    }

    const getChildPages = () => {
        return Object.values(pages).filter((p) => p.parentPageId === currentPage.id);
    }

    const handleCreatePage = (event: React.KeyboardEvent) => {
        // Do something
        event.stopPropagation();
        if (event.key === "Enter") {
            createPage(params.notebookId ?? "", params.sectionId ?? "", pageInputRef?.current?.value ?? "");
            setCreatingPage(false);
        }
    }

    const handleCreateNestedPage = (event: React.KeyboardEvent) => {
        // Do something
        event.stopPropagation();
        if (event.key === "Enter") {
            createPage(params.notebookId ?? "", params.sectionId ?? "", pageInputRef?.current?.value ?? "", currentPage.id);
            setCreatingPage(false);
        }
    }

    // Level will be a multiplier for nesting
    return (
        <div style={{ marginLeft: `${4 * currentPage.level}px` }}>
            <div className={cn("flex flex-row justify-between w-full items-center text-sm relative", params.pageId === currentPage.id && "bg-blue-200")}>
                <NavLink to={`notebook/${getNotebookId(currentPage.path)}/section/${sectionId}/page/${currentPage.id}`} >
                    <div className={cn("text-left p-2 text-primary",
                    )}>
                        <h4 className="truncate max-w-36" style={{
                            maxWidth: `${144 - currentPage.level * 12}px`
                        }}
                            title={currentPage.title}>{currentPage.title}</h4>
                    </div>
                </NavLink >
                <div className="mr-4">
                    <Button size="icon" variant="ghost" className=" w-4 h-4" onClick={() => { setOpen(!open) }} >
                        {
                            open && <ChevronUp className="w-2 h-2" />
                        }
                        {
                            !open && <ChevronDown className="w-2 h-2" />
                        }
                    </Button>
                </div>
            </div>
            <div title="Add nested page" className="text-muted-foreground w-full h-1 bg-transparent hover:bg-blue-300 cursor-cell ml-4" onClick={() => {
                setCreatingPage(true);
                setOpen(true);
            }}></div>
            {
                open &&
                getChildPages().map((child, index) => {
                    return <PageItem currentPage={child} key={index} />
                })
            }
            {
                open && creatingPage && <div className="w-full">
                    <Input
                        autoFocus
                        ref={pageInputRef}
                        placeholder={"Untitled Notebook"}
                        variant="smallUnderline"
                        startIcon={FileIcon}
                        style={{ maxWidth: '80%' }}
                        onKeyDown={handleCreateNestedPage}
                        onBlur={() => setCreatingPage(false)}
                    />
                </div>
            }
        </div>
    )
}