import { toast } from "@/hooks/use-toast";
import { NotebookId, Section } from "@/lib/definitions";
import { usePageStore } from "@/lib/stores/page-store";
import { useSectionStore } from "@/lib/stores/section-store";
import { cn } from "@/lib/utils";
import { EllipsisVertical, Pencil, Plus, Trash2 } from "lucide-react";
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

export const SectionTree = ({ notebookId }: { notebookId: NotebookId }) => {
  const params = useParams();
  const { sections, createSection } = useSectionStore();
  const [creatingSection, setCreatingSection] = useState<boolean>(false);
  const sectionInputRef = useRef<ElementRef<"input">>(null);

  const getSectionsByNotebook = (notebookId: string) => {
    return Object.values(sections).filter((s) => s.notebookId === notebookId);
  };

  const createNewSection = (notebookId: NotebookId, name: string) => {
    createSection(notebookId, name, "1");
    setCreatingSection(false);
  };
  return (
    <>
      {getSectionsByNotebook(notebookId).map((section, index) => {
        return (
          <SectionItem
            notebookId={notebookId}
            section={section}
            selected={params.sectionId === section.id}
            key={index}
          />
        );
      })}
      {creatingSection ? (
        <div className="w-full">
          <Input
            autoFocus
            ref={sectionInputRef}
            placeholder={"Untitled Section"}
            style={{ maxWidth: "100%" }}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter") {
                createNewSection(
                  notebookId,
                  sectionInputRef?.current?.value ?? "Untitled section"
                );
                setCreatingSection(false);
              }
            }}
            onBlur={() => setCreatingSection(false)}
          />
        </div>
      ) : (
        <Button
          variant="ghost"
          className="w-full px-2 text-xs h-6 text-muted-foreground"
          onClick={() => setCreatingSection(true)}
        >
          <Plus /> Section
        </Button>
      )}
    </>
  );
};

const SectionItem = ({
  notebookId,
  section,
  selected,
}: {
  notebookId: NotebookId;
  section: Section;
  selected: boolean;
}) => {
  const { updateSectionById, removeSection } = useSectionStore();
  const { removeBySection } = usePageStore();
  const [editing, setEditing] = useState<boolean>(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditing(false);
      toast({
        variant: "success",
        description: "Successfully updated section name.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the section name
    updateSectionById(section.id, {
      name: e.target.value,
    });
  };

  const handleDeleteClick = () => {
    removeSection(section.id);
    // Delete all related pages
    removeBySection(section.id);
  };

  return (
    <NavLink to={`notebook/${notebookId}/section/${section.id}`}>
      <div
        className={cn(
          "text-left p-1 text-primary-foreground flex flex-row justify-between items-center",
          selected && "bg-zinc-800/70"
        )}
        style={{ borderLeft: `4px solid ${section.color}` }}
      >
        {editing ? (
          <Input
            autoFocus
            variant="transparent"
            placeholder={section.name}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onBlur={() => setEditing(false)}
          />
        ) : (
          <span>{section.name}</span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-transparent w-fit h-fit p-1 outline-none focus:outline-none border-0 focus-visible:outline-none">
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deleting section "{section.name}" is irreversible. This will
                    permanently remove this section and all related pages.
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </NavLink>
  );
};

export default SectionTree;
