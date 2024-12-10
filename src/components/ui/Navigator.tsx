import { Page } from '@/lib/definitions';
import { notebooks, pages, sections } from '@/lib/dummyData';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronsRight, ChevronUp, Droplets, PlusCircle, Search } from 'lucide-react';
import { ElementRef, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
import { Label } from './Label';
import { NavGroup, NavGroupContent, NavGroupItem, NavGroupTrigger } from './NavGroup';
import { ScrollArea, ScrollBar } from './ScrollArea';

export const Navigator = () => {
    return (
        <div className="flex flex-row gap-0">
            <NavBar />
            <PageBar />
        </div>
    )
}

const NavBar = () => {

    const params = useParams();

    const getSectionsByNotebook = (notebookId: string) => {
        return sections.filter((s) => s.notebookId === notebookId);
    }

    return (
        <Sidebar>
            <header className="flex flex-row gap-4 items-center p-4 pb-2">
                <Droplets className="text-blue-500" />
                <h2 className="text-3xl title-font">Mizu</h2>
            </header>
            <div className="px-4">
                <Input startIcon={Search} placeholder='Search' className="bg-zinc-800 rounded-sm border-blue-600 border-[1px] h-7" />
            </div>
            <div className="flex flex-col w-full px-4 items-start">
                <Label className="text-xs text-muted-foreground">NOTEBOOKS</Label>
                <NavGroup type="multiple" className="w-full">
                    {
                        notebooks.map((notebook, index) => {
                            return (
                                <NavGroupItem value={notebook.id} key={index}>
                                    <NavGroupTrigger>
                                        <div className="flex flex-row gap-2 items-center">
                                            <span className="max-w-32 truncate" title={notebook.name}>{notebook.name}</span>
                                        </div>
                                    </NavGroupTrigger>
                                    <NavGroupContent className="flex flex-col gap-2 ml-4">
                                        {
                                            getSectionsByNotebook(notebook.id).map((section, index) => {
                                                return (
                                                    <NavLink to={`notebook/${notebook.id}/section/${section.id}`} key={index}>
                                                        <div className={cn("text-left p-1 text-primary-foreground",
                                                            params.sectionId === section.id && "bg-zinc-800"
                                                        )}
                                                            style={{ borderLeft: `2px solid ${section.color}` }}>
                                                            {section.name}
                                                        </div>
                                                    </NavLink>
                                                )
                                            })
                                        }
                                    </NavGroupContent>
                                </NavGroupItem>
                            )
                        })
                    }
                </NavGroup>
            </div>
        </Sidebar>
    )
}

const PageBar = () => {

    const params = useParams();

    if (!params || !params.sectionId) return;

    // We know for sure section exists, so get the pages under a specific section
    const sectionId = params.sectionId;

    return (
        <Sidebar>
            <div className="p-4 pb-0 flex flex-row justify-between">
                <Button>Add Note <PlusCircle /></Button>
            </div>
            <ScrollArea className="w-full h-full">
                <PageTree sectionId={sectionId} />
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </Sidebar>
    )
}

const PageTree = ({ sectionId }: { sectionId: string }) => {

    const getTopLevelPagesFromSection = () => {
        return pages.filter((p) => p.level === 0 && p.sectionId === sectionId);
    }

    // TODO: use this regex expression when UUID is implemented
    // const notebookIdRegex = /^notebook-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;

    // TODO: use recursion to render nested pages
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

const PageItem = ({ currentPage }: {
    currentPage: Page
}) => {
    const [open, setOpen] = useState<boolean>(false);
    // Get all the pages under the current level
    const params = useParams();
    const sectionId = params.sectionId;

    // Use regex to match the notebook id; temporary while UUID4 is not implemented
    const getNotebookId = (path: string) => {
        const notebookIdRegex = /^notebook-\d+/;
        const matches = path.match(notebookIdRegex);
        return matches ? matches[0] : "";
    }

    const getChildPages = () => {
        return pages.filter((p) => p.parentPageId === currentPage.id);
    }

    // Level will be a multiplier for nesting
    return (
        <div style={{ marginLeft: `${4 * currentPage.level}px` }}>
            <div className={cn("flex flex-row justify-between w-full items-center text-sm", params.pageId === currentPage.id && "bg-zinc-700")}>
                <NavLink to={`notebook/${getNotebookId(currentPage.path)}/section/${sectionId}/page/${currentPage.id}`} >
                    <div className={cn("text-left p-2 text-primary-foreground",
                    )}>
                        <h4 className="truncate max-w-36" style={{
                            maxWidth: `${144 - currentPage.level * 12}px`
                        }}
                            title={currentPage.title}>{currentPage.title}</h4>
                    </div>
                </NavLink >
                <div className="mr-4">
                    <Button size="icon" variant="ghost" onClick={() => { setOpen(!open) }} >
                        {
                            open && <ChevronUp className="w-4 h-4" />
                        }
                        {
                            !open && <ChevronDown className="w-4 h-4" />
                        }
                    </Button>
                </div>
            </div>
            {
                open &&
                getChildPages().map((child, index) => {
                    return <PageItem currentPage={child} key={index} />
                })

            }
        </div>
    )
}

const Sidebar = ({ children }: { children: React.ReactNode }) => {

    const [collapsed, setCollapsed] = useState(false);
    const sidebarRef = useRef<ElementRef<"div">>(null);
    const isResizingRef = useRef<boolean>(false);

    const MIN_WIDTH = 160; // Minimum width in px
    const MAX_WIDTH = 250; // Maximum width in px

    const handleRailClick = () => {
        console.log("Rail clicked");
        console.log(sidebarRef?.current?.clientWidth);
        setCollapsed(true)
    };

    const HandleTrigger = () => {
        return (
            <div className="h-screen w-2 bg-zinc-800 flex flex-col items-center z-[99999] hover:bg-zinc-700" onClick={() => { setCollapsed(false) }}>
                <ChevronsRight className="w-3 h-3 text-white my-4" />
            </div>
        )
    }

    // Handle Mouse Down
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizingRef.current = true;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {

        if (!isResizingRef || !sidebarRef.current) return;

        // Calculate new width based on cursor position
        const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;

        // Determine the clamped width
        const clampedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));

        // Update width using ref to avoid unnecessary renders
        sidebarRef.current.style.width = `${clampedWidth}px`;
        // setWidth(clampedWidth);  // Optionally update state if needed elsewhere
    };


    // Handle Mouse Up
    const handleMouseUp = () => {
        isResizingRef.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    if (collapsed) return <HandleTrigger />

    return (
        <div
            ref={sidebarRef}
            className="relative w-[12vw] min-w-40 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col gap-4 text-primary-foreground"
        >
            {children}

            {/* Sidebar Rail */}
            <div
                className="absolute top-0 right-0 w-1 h-full bg-transparent cursor-col-resize"
                onClick={handleRailClick}
                onMouseDown={handleMouseDown}
            ></div>
        </div>
    );
};


export default Navigator