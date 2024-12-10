import NoteMeta from "@/components/ui/NoteMeta";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useParams } from "react-router-dom";

const NotePage = () => {

    const editor = useCreateBlockNote();

    const params = useParams();
    if (!params.pageId) {
        return (
            <div className="w-full h-screen items-center justify-center flex flex-col">
                <h3 className="text-3xl"> No page selected </h3>
            </div>
        )
    }

    return (
        <div>
            <NoteMeta />
            <main className="w-full h-full">
                <BlockNoteView editor={editor} theme={lightDefaultTheme} />
            </main>
        </div>
    )
}

export default NotePage