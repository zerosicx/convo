import Navigator from "@/components/ui/Navigator";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import SearchModal from "@/components/ui/SearchModal";
import { useSearch } from "@/lib/stores/use-search";
import NotePage from "@/pages/NotePage";
import { useEffect } from "react";

const MainLayout = () => {
  const { setOpen } = useSearch();

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault(); // Prevent default browser save action
      setOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-row w-screen h-screen overflow-hidden items-start bg-zinc-50">
      <Navigator />
      <SearchModal />
      <main className="w-full h-screen items-center justify-center overflow-clip">
        <ScrollArea className="h-full">
          <NotePage />
          <ScrollBar />
        </ScrollArea>
      </main>
    </div>
  );
};

export default MainLayout;
