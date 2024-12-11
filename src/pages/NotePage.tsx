/* eslint-disable react-hooks/rules-of-hooks */
import NoteMeta from "@/components/ui/NoteMeta";
import { usePageStore } from "@/lib/stores/page-store";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const NotePage = () => {
    const params = useParams();
    const { getPageById, updatePageById } = usePageStore();

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
            return BlockNoteEditor.create({})
        }
        return BlockNoteEditor.create({ initialContent });
    }, [initialContent, params.pageId]);

    // Handle Content Change (extracted)
    const handleContentChange = useCallback(() => {
        if (page?.id && editor) {
            updatePageById(page.id, {
                data: JSON.stringify(editor.document),
            });
        }
    }, [editor, page?.id, updatePageById]);

    // Handle missing pageId
    if (!params.pageId) {
        return (
            <div className="w-full h-screen items-center justify-center flex flex-col gap-10">
                <h3 className="text-2xl font-italic">Why not write a new note?</h3>
                <img src='/writing.webp' width={350} height={350} className="rounded-md drop-shadow-md" />
            </div>
        );
    }

    return (
        <div>
            <NoteMeta />
            <main className="w-full h-full">
                {
                    editor && <BlockNoteView
                        className="overflow-hidden"
                        editor={editor}
                        theme={lightDefaultTheme}
                        onChange={handleContentChange}
                    />
                }
            </main>
        </div>
    );
};

export default NotePage;
