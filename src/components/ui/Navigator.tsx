import { Droplets, Search } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Input } from './input';
import { Label } from './label';

export const Navigator = () => {
    return (
        <div className="flex flex-row gap-0">
            <NavBar />
            <PageBar />
        </div>
    )
}

const NavBar = () => {
    return (
        <Sidebar>
            <header className="flex flex-row gap-4 items-center px-4"><Droplets className="text-blue-500" /><h2 className="text-2xl">Mizu</h2></header>
            <div className="px-4">
                <Input startIcon={Search} placeholder='Search' className="bg-zinc-50" />
            </div>
            <div className="flex flex-col w-full px-4 items-start">
                <Label className="text-sm text-muted-foreground">NOTEBOOKS</Label>
            </div>
        </Sidebar>
    )
}

const PageBar = () => {
    // Only display if there are params showing

    const params = useParams();
    console.log(params);

    if (!params || !params.pageId) return;

    return (
        <Sidebar>
            <div>PageBar</div>
        </Sidebar>
    )
}

const Sidebar = ({ children }: {
    children: React.ReactNode,
}) => {
    return (
        <div className="w-[15vw] min-w-60 h-screen bg-zinc-100 border-r border-zinc-300 flex flex-col gap-4">
            {children}
        </div>
    )
}

export default Navigator