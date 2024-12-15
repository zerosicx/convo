import { useDndStore } from "@/lib/stores/dnd-store";
import { usePageStore } from "@/lib/stores/page-store";
import { useSectionStore } from "@/lib/stores/section-store";
import { cn, getOs } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  ChevronsRight,
  Command,
  FileIcon,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./Button";
import { Input } from "./Input";
import { Label } from "./Label";
import { ScrollArea, ScrollBar } from "./ScrollArea";
import NotebookTree from "./navigator/NotebookTree";
import { PageTree } from "./navigator/PageTree";

export const Navigator = () => {
  const { setActiveId } = useDndStore();
  const { orderedPages, updatePageList, getPageById, updatePageById } =
    usePageStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

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

      if (
        activePage?.level === overPage?.level &&
        activePage?.parentPageId !== overPage?.parentPageId
      ) {
        // Update the active page's parent to be the same as over page, only if they're the same level.
        console.log(
          `Updating ${activePage?.title}'s parent to ${activePage?.parentPageId}'s parent. `
        );
        updatePageById(activePage?.id as string, {
          parentPageId: overPage?.parentPageId,
        });
      }

      // If the active page is more nested, set active's parent to the over item.
      else if ((activePage?.level || 0) > (overPage?.level || 0)) {
        updatePageById(activePage?.id as string, {
          parentPageId: overPage?.id,
        });
      }

      // If the active page is less nested, make it nested to the same parent as the over page
      else if ((activePage?.level || 0) < (overPage?.level || 0)) {
        updatePageById(activePage?.id as string, {
          parentPageId: overPage?.parentPageId,
          level: overPage?.level,
        });
      }
      setActiveId("");
    } else {
      updatePageById(active.id as string, { parentPageId: null, level: 0 });
    }
  };

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
};

const NavBar = () => {
  const nav = useNavigate();

  return (
    <Sidebar minWidth={250}>
      <header className="flex flex-row gap-4 items-center p-4 pb-0">
        <h2
          className="text-lg font-bold cursor-pointer"
          onClick={() => nav("/")}
          title="Return to landing page"
        >
          Convo
        </h2>
      </header>
      <div className="mx-3 flex flex-col gap-0">
        <div className="p-1 hover:bg-zinc-700 flex flex-row items-center justify-between rounded-md">
          <Label className=" text-xs flex flex-row items-center justify-between gap-2">
            <Search className="w-3.5 h-3.5" />
            Search
          </Label>
          <div className="flex flex-row items-center justify-between bg-zinc-600 rounded-md text-[0.6rem] p-1 gap-0.5">
            <span>
              {getOs() === "Windows" ? (
                "Ctrl"
              ) : (
                <Command className="w-2.5 h-2.5" />
              )}
            </span>
            <span>{"+ S"}</span>
          </div>
        </div>
        <div className="p-1 hover:bg-zinc-700 flex flex-row items-center justify-between rounded-md">
          <Label className="flex flex-row items-center justify-between gap-2 text-xs">
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Label>
          <div className="flex flex-row items-center justify-between bg-zinc-600 rounded-md text-[0.6rem] p-1 gap-0.5">
            <span>
              {getOs() === "Windows" ? (
                "Ctrl"
              ) : (
                <Command className="w-2.5 h-2.5" />
              )}
            </span>
            <span>{"+ /"}</span>
          </div>
        </div>
      </div>
      <NotebookTree />
    </Sidebar>
  );
};

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
      createPage(
        params?.notebookId ?? "",
        sectionId,
        pageInputRef?.current?.value || "Untitled Page"
      );
      setCreatingPage(false);
    }
  };

  return (
    <Sidebar className="bg-zinc-100" minWidth={250}>
      <div className="p-4 pb-0 flex flex-row justify-between items-center">
        <Label className="text-zinc-800 text-sm">
          {getSectionById(sectionId)?.name.toLocaleUpperCase()}
          <span> pages </span>
        </Label>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCreatingPage(true)}
        >
          <Plus className="text-zinc-800" />
        </Button>
      </div>
      <ScrollArea
        className="h-full"
        style={{ maxWidth: "inherit", width: "inherit" }}
      >
        <PageTree sectionId={sectionId} />
        {creatingPage && (
          <div className="w-full px-2">
            <Input
              autoFocus
              ref={pageInputRef}
              placeholder={"Untitled Page"}
              startIcon={FileIcon}
              onKeyDown={handleCreatePage}
              onBlur={() => setCreatingPage(false)}
              className="text-zinc-800 border-0 outline-none focus:outline-none shadow-none"
            />
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Sidebar>
  );
};

type SidebarProps = {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const Sidebar = ({
  children,
  minWidth = 200,
  maxWidth = 300,
  className,
  ...rest
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<ElementRef<"div">>(null);
  const isResizingRef = useRef<boolean>(false);

  const MIN_WIDTH = minWidth; // Minimum width in px
  const MAX_WIDTH = maxWidth; // Maximum width in px

  const handleRailClick = () => {
    console.log("Rail clicked");
    console.log(sidebarRef?.current?.clientWidth);
    setCollapsed(!collapsed);
  };

  const HandleTrigger = () => {
    return (
      <div
        className="h-screen w-2 bg-brand-background flex flex-col items-center z-[99999] hover:bg-zinc-600"
        onClick={() => {
          setCollapsed(false);
        }}
      >
        <ChevronsRight className="w-3 h-3 my-4 text-zinc-50" />
      </div>
    );
  };

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
    const newWidth =
      e.clientX - sidebarRef.current.getBoundingClientRect().left;

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

  if (collapsed) return <HandleTrigger />;

  return (
    <div
      {...rest}
      ref={sidebarRef}
      className={cn(
        "relative min-w-40 h-screen bg-brand-background flex flex-col gap-4 text-primary-foreground drop-shadow-md",
        className
      )}
      style={{
        width: minWidth,
      }}
    >
      {children}

      {/* Sidebar Rail */}
      <div
        className="absolute top-0 right-0 w-[2px] h-full bg-transparent cursor-col-resize hover:bg-zinc-400"
        onClick={handleRailClick}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Navigator;
