import { toast } from '@/hooks/use-toast';
import { useDndStore } from '@/lib/stores/dnd-store';
import { useNotebookStore } from '@/lib/stores/notebook-store';
import { usePageStore } from '@/lib/stores/page-store';
import { useSectionStore } from '@/lib/stores/section-store';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { BookTextIcon, ChevronsRight, EllipsisVertical, FileIcon, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ElementRef, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
import { Label } from './Label';
import { NavGroup, NavGroupContent, NavGroupItem, NavGroupTrigger } from './NavGroup';
import { ScrollArea, ScrollBar } from './ScrollArea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import { PageTree } from './navigator/PageTree';
import { SectionTree } from './navigator/SectionTree';

export const Navigator = () => {
    const { setActiveId } = useDndStore();
    const { orderedPages, updatePageList, getPageById, updatePageById } = usePageStore();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        // Do something
        const { active, over } = event;
        console.log(`activeId: ${active.id}, overId: ${over?.id}`);

        if (active.id !== over?.id) {
            const newPages = (() => {
                const oldIndex = orderedPages.indexOf(active.id as string);
                const newIndex = orderedPages.indexOf(over?.id as string);

                return arrayMove(orderedPages, oldIndex, newIndex);
            })();
            updatePageList(newPages);


            // Get the parents of each item
            const activePage = getPageById(active.id as string);
            const overPage = getPageById(over?.id as string);

            if (activePage?.level === overPage?.level && activePage?.parentPageId !== overPage?.parentPageId) {
                // Update the active page's parent to be the same as over page, only if they're the same level.
                console.log(`Updating ${activePage?.title}'s parent to ${activePage?.parentPageId}'s parent. `);
                updatePageById(activePage?.id as string, { parentPageId: overPage?.parentPageId });
            }

            // If the active page is more nested, set active's parent to the over item.
            else if ((activePage?.level || 0) > (overPage?.level || 0)) {
                updatePageById(activePage?.id as string, { parentPageId: overPage?.id });
            }

            // If the active page is less nested, make it nested to the same parent as the over page
            else if ((activePage?.level || 0) < (overPage?.level || 0)) {
                updatePageById(activePage?.id as string, { parentPageId: overPage?.parentPageId, level: overPage?.level });
            }
            setActiveId("");
        } else {
            updatePageById(active.id as string, { parentPageId: null, level: 0 });
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div className="flex flex-row gap-0">
                <NavBar />
                <PageBar />
            </div>
        </DndContext>
    );
}

const NavBar = () => {

    const { notebooks, createNotebook, updateNotebookById, deleteNotebook } = useNotebookStore();
    const { removeSection } = useSectionStore();
    const { removeBySection } = usePageStore();
    const [creatingNotebook, setCreatingNotebook] = useState<boolean>(false);
    const notebookInputRef = useRef<ElementRef<"input">>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const nav = useNavigate();

    const handleCreateNewNotebook = (event: React.KeyboardEvent) => {
        event.stopPropagation();
        if (event.key === "Enter") {
            // Submit
            createNotebook(notebookInputRef?.current?.value ?? "Untitled Notebook", "1");
            setCreatingNotebook(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            setEditing(false);
            toast({
                variant: "success",
                description: `Successfully updated Notebook name.`
            })
        }
    }

    const handleChange = (newName: string, notebookId: string) => {
        // Update the section name
        updateNotebookById(notebookId, {
            name: newName
        });
    }

    const handleDeleteClick = (notebookId: string) => {
        const notebookToDelete = notebooks[notebookId];

        // Delete all related sections
        notebookToDelete.sections.map((sectionId) => {
            removeSection(sectionId);
            // Delete all related pages
            removeBySection(sectionId);

        })
        deleteNotebook(notebookId);
        nav("/app");
        toast({
            variant: 'destructive',
            description: 'Succesfully deleted Notebook and all associated sections and pages.'
        })
    }

    return (
        <Sidebar minWidth={250}>
            <header className="flex flex-row gap-4 items-center p-4 pb-0">
                <h2 className="text-lg font-bold cursor-pointer" onClick={() => nav('/')} title="Return to landing page">Convo</h2>
            </header>
            <div className="px-3">
                <Input startIcon={Search} placeholder='Search' className="rounded-sm h-7" />
            </div>
            <div className="flex flex-col w-full px-3 items-start">
                <div className="flex flex-row w-full justify-between items-center">
                    <Label className="text-xs text-muted-foreground">NOTEBOOKS</Label>
                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setCreatingNotebook(true)}><Plus /></Button>
                </div>
                <NavGroup type="multiple" className="w-full">
                    {
                        Object.values(notebooks).map((notebook, index) => {
                            return (
                                <NavGroupItem value={notebook.id} key={index}>
                                    <NavGroupTrigger>
                                        <div className="flex flex-row items-center justify-between w-full">
                                            {
                                                editing ? <Input autoFocus variant="transparent" placeholder={notebook.name} onKeyDown={handleKeyDown} onChange={(e) => {
                                                    handleChange(e.target.value, notebook.id)
                                                }} onBlur={() => setEditing(false)} /> : <span className="max-w-32 truncate" title={notebook.name}>{notebook.name}</span>
                                            }
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="bg-transparent w-fit h-fit p-1 outline-none focus:outline-none border-0 focus-visible:outline-none">
                                                    <Button variant="ghost" size="icon">
                                                        <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="px-2">
                                                    <Label className="text-muted-foreground">Edit Menu</Label>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setEditing(true)}>
                                                        <Pencil className="w-4 h-4 text-muted-foreground" /> <span className="text-neutral-800">Rename</span>
                                                    </DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger className="bg-transparent rounded-sm text-sm flex flex-row items-center  w-full py-1.5 px-2 gap-2 font-normal outline-none border-0 focus:outline-none focus-visible:outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground">
                                                            <Trash2 className="w-4 h-4 text-muted-foreground" /> <span className="text-neutral-800">Delete</span>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you absolutely sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Deleting notebook "{notebook.name}" is irreversible. This will permanently remove this notebook and all related sections and pages.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction className="bg-red-700" onClick={() => { handleDeleteClick(notebook.id) }}>Continue</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </NavGroupTrigger>
                                    <NavGroupContent className="flex flex-col gap-2 ml-4">
                                        <SectionTree notebookId={notebook.id} />
                                    </NavGroupContent>
                                </NavGroupItem>
                            )
                        })
                    }
                </NavGroup>
                {
                    creatingNotebook && <div className="w-full">
                        <Input
                            autoFocus
                            ref={notebookInputRef}
                            placeholder={"Untitled Notebook"}
                            startIcon={BookTextIcon}
                            onKeyDown={handleCreateNewNotebook}
                            onBlur={() => setCreatingNotebook(false)}
                        />
                    </div>
                }
            </div>
        </Sidebar>
    )
}

const PageBar = () => {

    const params = useParams();
    const [creatingPage, setCreatingPage] = useState(false);
    const pageInputRef = useRef<ElementRef<"input">>(null);
    const { createPage } = usePageStore();
    const { getSectionById } = useSectionStore();

    if (!params || !params.sectionId) return;

    // We know for sure section exists, so get the pages under a specific section
    const sectionId = params.sectionId;

    const handleCreatePage = (event: React.KeyboardEvent) => {
        // Do something
        event.stopPropagation();
        if (event.key === "Enter") {
            console.log(pageInputRef?.current?.value);
            createPage(params?.notebookId ?? "", sectionId, pageInputRef?.current?.value || "Untitled Page");
            setCreatingPage(false);
        }
    }

    return (
        <Sidebar>
            <div className="p-4 pb-0 flex flex-row justify-between items-center">
                <Label className="text-muted-foreground text-sm">
                    {
                        getSectionById(sectionId)?.name.toLocaleUpperCase()
                    }
                    <span> pages </span>
                </Label>
                <Button size="icon" variant="ghost" onClick={() => setCreatingPage(true)}><Plus className="text-muted-foreground" /></Button>
            </div>
            <ScrollArea className="w-full h-full">
                <PageTree sectionId={sectionId} />
                {
                    creatingPage && <div className="w-full px-2">
                        <Input
                            className="w-full"
                            autoFocus
                            ref={pageInputRef}
                            placeholder={"Untitled Page"}
                            startIcon={FileIcon}
                            onKeyDown={handleCreatePage}
                            onBlur={() => setCreatingPage(false)}
                        />
                    </div>
                }
                <div className="h-5" ></div>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>
        </Sidebar>
    )
}

const Sidebar = ({ children, minWidth = 200, maxWidth = 300 }: {
    children: React.ReactNode,
    minWidth?: number,
    maxWidth?: number
}) => {

    const [collapsed, setCollapsed] = useState(false);
    const sidebarRef = useRef<ElementRef<"div">>(null);
    const isResizingRef = useRef<boolean>(false);

    const MIN_WIDTH = minWidth; // Minimum width in px
    const MAX_WIDTH = maxWidth; // Maximum width in px

    const handleRailClick = () => {
        console.log("Rail clicked");
        console.log(sidebarRef?.current?.clientWidth);
        setCollapsed(!collapsed)
    };

    const HandleTrigger = () => {
        return (
            <div className="h-screen w-2 bg-neutral-200 flex flex-col items-center z-[99999] hover:bg-blue-200" onClick={() => { setCollapsed(false) }}>
                <ChevronsRight className="w-3 h-3 my-4" />
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
            className="relative min-w-40 h-screen bg-white border-r border-neutral-50 flex flex-col gap-4 text-primary drop-shadow-md"
            style={{
                width: minWidth
            }}
        >
            {children}

            {/* Sidebar Rail */}
            <div
                className="absolute top-0 right-0 w-[2px] h-full bg-transparent cursor-col-resize hover:bg-blue-200"
                onClick={handleRailClick}
                onMouseDown={handleMouseDown}
            ></div>
        </div>
    );
};


export default Navigator