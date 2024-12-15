import { toast } from "@/hooks/use-toast";
import { Page } from "@/lib/definitions";
import { useDndStore } from "@/lib/stores/dnd-store";
import { usePageStore } from "@/lib/stores/page-store";
import { cn } from "@/lib/utils";
import { DragOverlay } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  FolderInput,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";
import { Button } from "../Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Input } from "../Input";
import { Label } from "../Label";

export const PageTree = ({ sectionId }: { sectionId: string }) => {
  const { pages, orderedPages } = usePageStore();
  const { activeId } = useDndStore();

  // Modify this function to use orderedPages and retrieve the actual page objects
  const getTopLevelPagesFromSection = () => {
    return orderedPages
      .map((pageId) => pages[pageId]) // Map the orderedPage IDs to the corresponding Page objects
      .filter(
        (page) => page && page.level === 0 && page.sectionId === sectionId
      ); // Filter based on the sectionId and level
  };

  return (
    <div className="mb-4" style={{ maxWidth: "inherit", width: "inherit" }}>
      <SortableContext
        items={orderedPages}
        strategy={verticalListSortingStrategy}
      >
        {getTopLevelPagesFromSection().map((page, index) => {
          return <PageItem currentPage={page} key={index} />;
        })}
        <DragOverlay modifiers={[restrictToParentElement]}>
          {activeId && <PageItem currentPage={pages[activeId]} />}
        </DragOverlay>
      </SortableContext>
    </div>
  );
};

export const PageItem = ({ currentPage }: { currentPage: Page }) => {
  const [open, setOpen] = useState<boolean>(false);
  // Get all the pages under the current level
  const params = useParams();
  const sectionId = params.sectionId;
  const { getPageList, updatePageById, removePage } = usePageStore();
  const pages = getPageList();
  const [creatingPage, setCreatingPage] = useState(false);
  const pageInputRef = useRef<ElementRef<"input">>(null);
  const { createPage } = usePageStore();
  const [editing, setEditing] = useState<boolean>(false);

  // Use regex to match the notebook id; temporary while UUID4 is not implemented
  const getNotebookId = (path: string) => {
    // TODO: use this regex expression when UUID is implemented
    return path.split("/")[0];
  };

  const childPages = (() => {
    return Object.values(pages).filter(
      (p) => p.parentPageId === currentPage.id
    );
  })();

  const handleCreateNestedPage = (event: React.KeyboardEvent) => {
    // Do something
    event.stopPropagation();
    if (event.key === "Enter") {
      createPage(
        params.notebookId ?? "",
        params.sectionId ?? "",
        pageInputRef?.current?.value ?? "Untitled Page",
        currentPage.id
      );
      setCreatingPage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditing(false);
      toast({
        variant: "success",
        description: `Successfully updated page title to ${currentPage.title}`,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the section name
    updatePageById(currentPage.id, {
      title: e.target.value,
    });
  };

  const handleDeleteClick = () => {
    removePage(currentPage.id);
    // Delete all related pages
    removePage(currentPage.id);
  };

  // Sortable config
  const {
    attributes,
    listeners,
    setNodeRef,
    // transform,
    // transition
  } = useSortable({ id: currentPage.id });

  // TODO: Avoiding transform due to dnd-kit DragOverlay issue.
  // const transformStyle = {
  //     transform: CSS.Transform.toString(transform),
  //     transition
  // };

  // Level will be a multiplier for nesting
  return (
    <div
      style={{ marginLeft: `${4 * currentPage.level}px` }}
      ref={setNodeRef}
      {...attributes}
    >
      <div
        className={cn(
          "flex flex-row justify-between  items-center text-sm relative mx-2 rounded-md h-10",
          params.pageId === currentPage.id && "bg-zinc-200/80"
        )}
      >
        <NavLink
          to={`notebook/${getNotebookId(
            currentPage.path
          )}/section/${sectionId}/page/${currentPage.id}`}
          className="w-full"
        >
          <div className="flex flex-row items-center pl-2 gap-1">
            <GripVertical
              className="w-4 h-4 text-transparent hover:text-zinc-800 hover:bg-muted"
              {...listeners}
            />

            <div className={cn("text-left text-primary w-full")}>
              {editing ? (
                <Input
                  autoFocus
                  placeholder={currentPage.title}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                  onBlur={() => setEditing(false)}
                  className="text-zinc-800 border-0 outline-none focus:outline-none shadow-none"
                />
              ) : (
                <h4
                  className="truncate max-w-36 font-medium"
                  style={{
                    maxWidth: `${144 - currentPage.level * 12}px`,
                  }}
                  title={currentPage.title}
                >
                  {currentPage.title}
                </h4>
              )}
            </div>
          </div>
        </NavLink>
        <div
          title="Add nested page"
          className="absolute bottom-0 text-zinc-800 w-full h-1 bg-transparent hover:bg-brand cursor-cell rounded-md rounded-t-none"
          onClick={() => {
            setCreatingPage(true);
            setOpen(true);
          }}
          style={{ marginLeft: `${4 * currentPage.level}px` }}
        ></div>
        <div className="mr-4 flex flex-row gap-1 items-center">
          {childPages.length >= 1 && (
            <Button
              size="icon"
              variant="ghost"
              className="w-4 h-4 hover:text-muted-foreground hover:bg-zinc-200 active:bg-zinc-400"
              onClick={() => {
                setOpen(!open);
              }}
            >
              {open && <ChevronDown className="w-2 h-2 text-zinc-800" />}
              {!open && <ChevronRight className="w-2 h-2 text-zinc-800" />}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-transparent p-1 outline-none focus:outline-none border-0 focus-visible:outline-none">
              <EllipsisVertical className="w-4 h-4 text-zinc-800" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="px-2">
              <Label className="text-zinc-800">Edit Menu</Label>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                  setCreatingPage(true);
                }}
              >
                <Plus className="w-4 h-4 text-zinc-800" />{" "}
                <span className="text-zinc-800">Add nested page</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <Pencil className="w-4 h-4 text-zinc-800" />{" "}
                <span className="text-zinc-800">Rename</span>
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger className="bg-transparent rounded-sm text-sm flex flex-row items-center  w-full py-1.5 px-2 gap-2 font-normal outline-none border-0 focus:outline-none focus-visible:outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground">
                  <Trash2 className="w-4 h-4 text-zinc-800" />{" "}
                  <span className="text-zinc-800">Delete</span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Deleting page "{currentPage.title}" is irreversible. This
                      will permanently remove this page, along with:{" "}
                      {childPages.map((child, index) =>
                        index === childPages.length - 1 ? (
                          <span>and "{child.title}".</span>
                        ) : (
                          <span>"{child.title}", </span>
                        )
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-700"
                      onClick={handleDeleteClick}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <DropdownMenuItem disabled>
                <FolderInput className="w-4 h-4 text-zinc-800" />{" "}
                <span>Move to...</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {open &&
        childPages.map((child, index) => {
          return <PageItem currentPage={child} key={index} />;
        })}
      {open && creatingPage && (
        <div
          style={{
            marginLeft: `${currentPage.level * 12 + 24}px`,
          }}
        >
          <Input
            autoFocus
            ref={pageInputRef}
            placeholder={"Untitled Page"}
            onKeyDown={handleCreateNestedPage}
            onBlur={() => setCreatingPage(false)}
            className="text-zinc-800 border-0 outline-none focus:outline-none shadow-none"
          />
        </div>
      )}
    </div>
  );
};
