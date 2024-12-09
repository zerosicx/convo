import Navigator from '@/components/ui/Navigator'
import { Outlet } from 'react-router-dom'

const MainLayout = () => (
    <div className="flex flex-row w-screen items-start">
        <Navigator />
        <main>
            <Outlet />
        </main>
    </div>
)

export default MainLayout