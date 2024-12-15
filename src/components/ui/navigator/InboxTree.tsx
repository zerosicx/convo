import { toast } from "@/hooks/use-toast";
import { Page } from "@/lib/definitions";
import { usePageStore } from "@/lib/stores/page-store";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  FolderInput,
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

export const InboxTree = ({ all = false }: { all?: boolean }) => {
  const { pages } = usePageStore();

  const getInboxPagesSortedByCreationDate = () => {
    return Object.values(pages)
      .filter((page) => page.sectionId === null)
      .filter((page) => page.level === 0)
      .sort(
        (a, b) =>
          new Date(a.creationDate).getTime() -
          new Date(b.creationDate).getTime()
      );
  };

  const getAllPagesSortedByCreationDate = () => {
    return Object.values(pages)
      .filter((page) => page.level === 0)
      .sort(
        (a, b) =>
          new Date(a.creationDate).getTime() -
          new Date(b.creationDate).getTime()
      );
  };

  return (
    <div className="mb-4" style={{ maxWidth: "inherit", width: "inherit" }}>
      {all
        ? getAllPagesSortedByCreationDate().map((page, index) => (
            <InboxTreeItem currentPage={page} key={index} all />
          ))
        : getInboxPagesSortedByCreationDate().map((page, index) => (
            <InboxTreeItem currentPage={page} key={index} />
          ))}
    </div>
  );
};

export const InboxTreeItem = ({
  currentPage,
  all = false,
}: {
  currentPage: Page;
  all?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const { getPageList, updatePageById, removePage } = usePageStore();
  const pages = getPageList();
  const { createPage } = usePageStore();
  const [creatingPage, setCreatingPage] = useState(false);
  const pageInputRef = useRef<ElementRef<"input">>(null);
  const params = useParams();

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
    updatePageById(currentPage.id, {
      title: e.target.value,
    });
  };

  const handleDeleteClick = () => {
    removePage(currentPage.id);
  };

  const childPages = (() => {
    return Object.values(pages).filter(
      (p) => p.parentPageId === currentPage.id
    );
  })();

  const handleCreateNestedPage = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      console.log("Creating a nested page gang gang");

      createPage(
        null,
        null,
        pageInputRef?.current?.value ?? "Untitled Page",
        currentPage.id
      );
      setCreatingPage(false);
    }
  };

  return (
    <div style={{ marginLeft: `${4 * currentPage.level}px` }}>
      <div
        className={cn(
          "flex flex-row justify-between items-center text-sm relative mx-2 rounded-md h-10",
          params.pageId === currentPage.id && "bg-zinc-200/80"
        )}
      >
        <NavLink
          to={
            all
              ? `pages/page/${currentPage.id}`
              : `inbox/page/${currentPage.id}`
          }
          className="w-full"
        >
          <div className="flex flex-row items-center pl-2 gap-1">
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
                  style={{ maxWidth: `${144 - currentPage.level * 12}px` }}
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
            <DropdownMenuTrigger className="bg-transparent p-1">
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
                <Pencil className="w-4 h-4 text-zinc-800" /> Rename
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
          return <InboxTreeItem currentPage={child} key={index} />;
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

export default InboxTree;
