import { Page } from "@/lib/definitions";
import { useNotebookStore } from "@/lib/stores/notebook-store";
import { usePageStore } from "@/lib/stores/page-store";
import { useSectionStore } from "@/lib/stores/section-store";
import { useSearch } from "@/lib/stores/use-search";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { BookHeart, Search } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Badge } from "./Badge";
import { Dialog, DialogContent, DialogHeader } from "./Dialog";
import { Input } from "./Input";
import { Separator } from "./Separator";

const SearchModal = () => {
  const { searchMatchString } = usePageStore();
  const [search, setSearch] = useState("");
  const { open, onClose } = useSearch();

  const searchInputStyle = {
    fontSize: "1rem",
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const results = searchMatchString(search);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-zinc-200 p-0 gap-0"
        aria-description="Search Modal"
      >
        <DialogHeader className="p-1">
          {/* Search Bar w/ Transparent Input */}
          <Input
            value={search}
            placeholder="Looking for something?"
            startIcon={Search}
            style={searchInputStyle}
            className="shadow-none"
            onChange={handleSearchChange}
          />
        </DialogHeader>
        <DialogDescription>
          <Separator className="bg-zinc-300" />
          <main className="p-2">
            {search === "" ? (
              <>
                <Label className="text-zinc-500 font-semibold text-xs px-1">
                  Most Recent
                </Label>
                {results.map((page) => (
                  <SearchResultItem key={page.id} page={page} />
                ))}
              </>
            ) : (
              <>
                <Label className="text-zinc-500 font-semibold text-xs px-1">
                  Search Results
                </Label>
                {results.map((page) => (
                  <SearchResultItem key={page.id} page={page} />
                ))}
              </>
            )}
          </main>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

const SearchResultItem = ({ page }: { page: Page }) => {
  const { getNotebookById } = useNotebookStore();
  const { getSectionById } = useSectionStore();
  const { onClose } = useSearch();

  const section = getSectionById(page.sectionId as string);
  const notebook = getNotebookById(section?.notebookId as string);

  return (
    <div className="flex flex-row gap-2 hover:bg-zinc-300 p-1 rounded-md text-sm">
      <NavLink
        to={
          notebook && section
            ? `notebook/${notebook.id}/section/${section.id}/page/${page.id}`
            : `pages/page/${page.id}`
        }
        onClick={() => {
          onClose();
        }}
        className="max-w-[60%]"
      >
        <h4 className="truncate">{page.title}</h4>
      </NavLink>
      <div className="w-full">
        {notebook && section ? (
          <NavLink
            to={`notebook/${notebook.id}/section/${section.id}`}
            onClick={() => {
              onClose();
            }}
          >
            <Badge
              variant="transparent"
              className="text-[0.7rem] text-zinc-500 font-medium h-6"
            >
              {"—"}
              <BookHeart className="w-4 mx-1 text-zinc-500" />{" "}
              {`${notebook.name} / ${section.name}`}
            </Badge>
          </NavLink>
        ) : (
          <Badge
            variant="transparent"
            className="text-[0.7rem] text-zinc-500 font-medium h-6"
          >
            {"— Uncategorised"}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
