import { toast } from "@/hooks/use-toast";
import { useNotebookStore } from "@/lib/stores/notebook-store";
import { usePageStore } from "@/lib/stores/page-store";
import { useSectionStore } from "@/lib/stores/section-store";
import {
  BookTextIcon,
  EllipsisVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "../AlertDialog";
import { Button } from "../Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../DropdownMenu";
import { Input } from "../Input";
import { Label } from "../Label";
import {
  NavGroup,
  NavGroupContent,
  NavGroupItem,
  NavGroupTrigger,
} from "../NavGroup";
import { ScrollArea } from "../ScrollArea";
import SectionTree from "./SectionTree";

const NotebookTree = () => {
  const { notebooks, createNotebook, updateNotebookById, deleteNotebook } =
    useNotebookStore();
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
      createNotebook(
        notebookInputRef?.current?.value ?? "Untitled Notebook",
        "1"
      );
      setCreatingNotebook(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditing(false);
      toast({
        variant: "success",
        description: `Successfully updated Notebook name.`,
      });
    }
  };

  const handleChange = (newName: string, notebookId: string) => {
    // Update the section name
    updateNotebookById(notebookId, {
      name: newName,
    });
  };

  const handleDeleteClick = (notebookId: string) => {
    const notebookToDelete = notebooks[notebookId];

    // Delete all related sections
    notebookToDelete.sections.map((sectionId) => {
      removeSection(sectionId);
      // Delete all related pages
      removeBySection(sectionId);
    });
    deleteNotebook(notebookId);
    nav("/app");
    toast({
      variant: "destructive",
      description:
        "Succesfully deleted Notebook and all associated sections and pages.",
    });
  };

  return (
    <ScrollArea className="flex flex-col w-full px-3 items-start">
      <div className="flex flex-row w-full justify-between items-center sticky top-0 bg-brand-background z-[99999]">
        <Label className="text-xs text-zinc-100">NOTEBOOKS</Label>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={() => setCreatingNotebook(true)}
        >
          <Plus />
        </Button>
      </div>
      <NavGroup type="multiple" className="w-full">
        {Object.values(notebooks).map((notebook, index) => {
          return (
            <NavGroupItem value={notebook.id} key={index}>
              <NavGroupTrigger>
                <div className="flex flex-row items-center justify-between w-full">
                  {editing ? (
                    <Input
                      autoFocus
                      variant="transparent"
                      placeholder={notebook.name}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => {
                        handleChange(e.target.value, notebook.id);
                      }}
                      onBlur={() => setEditing(false)}
                    />
                  ) : (
                    <span className="max-w-32 truncate" title={notebook.name}>
                      {notebook.name}
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-transparent w-fit h-fit p-1 outline-none focus:outline-none border-0 focus-visible:outline-none">
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="w-4 h-4 text-zinc-100" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="px-2">
                      <Label className="text-zinc-800">Edit Menu</Label>
                      <DropdownMenuSeparator />
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
                              Deleting notebook "{notebook.name}" is
                              irreversible. This will permanently remove this
                              notebook and all related sections and pages.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-700"
                              onClick={() => {
                                handleDeleteClick(notebook.id);
                              }}
                            >
                              Continue
                            </AlertDialogAction>
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
          );
        })}
      </NavGroup>
      {creatingNotebook && (
        <div className="w-full">
          <Input
            autoFocus
            ref={notebookInputRef}
            placeholder={"Untitled Notebook"}
            startIcon={BookTextIcon}
            onKeyDown={handleCreateNewNotebook}
            onBlur={() => setCreatingNotebook(false)}
          />
        </div>
      )}
    </ScrollArea>
  );
};

export default NotebookTree;
