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
            <div>NavBar</div>
        </Sidebar>
    )
}

const PageBar = () => {
    return (
        <Sidebar>
            <div>PageBar</div>
        </Sidebar>
    )
}

const Sidebar = ({ children }: {
    children: React.ReactElement
}) => {
    return (
        <div className="w-[15vw] min-w-60 h-screen bg-zinc-100 border-r border-zinc-300">
            {children}
        </div>
    )
}

export default Navigator