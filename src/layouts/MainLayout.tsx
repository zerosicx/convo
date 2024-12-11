import Navigator from '@/components/ui/Navigator'
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import NotePage from '@/pages/NotePage'

const MainLayout = () => (
    <div className="flex flex-row w-screen items-start">
        <Navigator />
        <main className="w-full h-screen items-center justify-center overflow-clip">
            <ScrollArea className="h-full">
                <NotePage />
                <ScrollBar />
            </ScrollArea>
        </main>
    </div>
)

export default MainLayout