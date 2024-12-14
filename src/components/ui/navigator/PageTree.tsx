import { Page } from "@/lib/definitions";
import { usePageStore } from "@/lib/stores/page-store";
import { cn } from "@/lib/utils";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, FileIcon, GripVertical } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button } from "../Button";
import { Input } from "../Input";


export const PageTree = ({ sectionId }: { sectionId: string }) => {
    const { pages, orderedPages } = usePageStore();

    // Modify this function to use orderedPages and retrieve the actual page objects
    const getTopLevelPagesFromSection = () => {
        return orderedPages
            .map(pageId => pages[pageId]) // Map the orderedPage IDs to the corresponding Page objects
            .filter(page => page && page.level === 0 && page.sectionId === sectionId); // Filter based on the sectionId and level
    }

    return (
        <div>
            <SortableContext
                items={orderedPages}
                strategy={verticalListSortingStrategy}
            >
                {
                    getTopLevelPagesFromSection().map((page, index) => {
                        return (
                            <PageItem currentPage={page} key={index} />
                        )
                    })
                }
            </SortableContext>
        </div>
    );
}

export const PageItem = ({ currentPage }: {
    currentPage: Page
}) => {
    const [open, setOpen] = useState<boolean>(false);
    // Get all the pages under the current level
    const params = useParams();
    const sectionId = params.sectionId;
    const { getPageList } = usePageStore();
    const pages = getPageList();
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

    const handleCreateNestedPage = (event: React.KeyboardEvent) => {
        // Do something
        event.stopPropagation();
        if (event.key === "Enter") {
            createPage(params.notebookId ?? "", params.sectionId ?? "", pageInputRef?.current?.value ?? "Untitled Page", currentPage.id);
            setCreatingPage(false);
        }
    }

    // Sortable config
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
    } = useSortable({ id: currentPage.id });

    const transformStyle = {
        transform: CSS.Transform.toString(transform),
    };

    // Level will be a multiplier for nesting
    return (
        <div style={{ marginLeft: `${4 * currentPage.level}px`, ...transformStyle }} ref={setNodeRef} {...attributes} >
            <div className={cn("flex flex-row justify-between w-full items-center text-sm relative", params.pageId === currentPage.id && "bg-neutral-200/80")}>
                <div className="flex flex-row items-center pl-2 gap-1">
                    <GripVertical className="w-4 h-4 text-transparent hover:text-muted-foreground hover:bg-muted" {...listeners} />
                    <NavLink to={`notebook/${getNotebookId(currentPage.path)}/section/${sectionId}/page/${currentPage.id}`} >
                        <div className={cn("text-left py-1 text-primary",
                        )}>
                            <h4 className="truncate max-w-36" style={{
                                maxWidth: `${144 - currentPage.level * 12}px`
                            }}
                                title={currentPage.title}>{currentPage.title}</h4>
                        </div>
                    </NavLink >
                </div>
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
                        placeholder={"Untitled Page"}
                        startIcon={FileIcon}
                        onKeyDown={handleCreateNestedPage}
                        onBlur={() => setCreatingPage(false)}
                    />
                </div>
            }
        </div>
    )
}