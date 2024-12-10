import NoteMeta from "@/components/ui/NoteMeta";
import { useParams } from "react-router-dom";

const NotePage = () => {

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
        </div>
    )
}

export default NotePage