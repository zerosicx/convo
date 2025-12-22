/* eslint-disable react-hooks/rules-of-hooks */
import { useUser } from "@clerk/clerk-react";
import noteImage from "@/assets/writing.webp";
import { Button } from "@/components/ui/Button";
import NoteMeta from "@/components/ui/NoteMeta";
import { usePageStore } from "@/lib/stores/page-store";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const NotePage = () => {
  const params = useParams();
  const { user } = useUser();
  const { getPageById, updatePageById, createPage } = usePageStore();
  const nav = useNavigate();
  const page = params.pageId ? getPageById(params.pageId) : null;

  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  // Loads the previously stored editor contents.
  useEffect(() => {
    setInitialContent(page?.data ? JSON.parse(page?.data) : "loading");
  }, [params.pageId]);

  // Creates a new editor instance.
  // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
  // can delay the creation of the editor until the initial content is loaded.
  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return BlockNoteEditor.create({});
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent, params.pageId]);

  // Handle Content Change (extracted)
  const handleContentChange = useCallback(() => {
    if (page?._id && editor) {
      updatePageById(page._id, {
        data: JSON.stringify(editor.document),
      });
    }
  }, [editor, page?._id, updatePageById]);

  const handleCreateQuickNote = () => {
    if (!user?.id) return;
    const newPage = createPage(user.id, null, null, "Quick Note 📝");
    nav(`inbox/page/${newPage._id}`);
  };

  // Handle missing pageId
  if (!params.pageId) {
    return (
      <div className="w-full h-screen items-center justify-center flex flex-col gap-4">
        <h3 className="text-2xl font-semibold">Why not write a new note?</h3>
        <Button onClick={handleCreateQuickNote}>Quick Note 📝</Button>
        <img
          src={noteImage}
          width={350}
          height={350}
          className="rounded-md drop-shadow-md"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <NoteMeta />
      <main className="w-full h-full">
        {editor && (
          <BlockNoteView
            className="overflow-hidden"
            editor={editor}
            onChange={handleContentChange}
          />
        )}
      </main>
    </div>
  );
};

export default NotePage;
