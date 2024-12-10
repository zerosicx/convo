import Navigator from '@/components/ui/Navigator'
import NotePage from '@/pages/NotePage'

const MainLayout = () => (
    <div className="flex flex-row w-screen items-start">
        <Navigator />
        <main className="w-full h-screen items-center justify-center">
            <NotePage />
        </main>
    </div>
)

export default MainLayout