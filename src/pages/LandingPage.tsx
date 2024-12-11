import { Button } from "@/components/ui/Button"
import { NavLink } from "react-router-dom"

const LandingPage = () => {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex flex-row justify-between fixed top-0 h-16 items-center gap-2 w-full p-2">
                <h2 className="text-3xl font-bold">Convo</h2>
                <div>
                    <NavLink to="/app">
                        <Button>Get Convo</Button>
                    </NavLink>
                </div>
            </div>
            <div className="flex flex-row gap-[150px]">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <h2 className="text-3xl font-italic">Keep it clear, keep it simple. </h2>
                    <h1 className="text-4xl font-semibold">Welcome to Convo.</h1>
                    <div className="flex flex-row gap-2">
                        <NavLink to="/app">
                            <Button size="lg" >Get Convo</Button>
                        </NavLink>
                        <Button size="lg" variant="secondary">Learn more</Button>
                    </div>
                </div>
                <img src="conversation.webp" height={400} width={400} className="rounded-md drop-shadow-md" />
            </div>
        </div>
    )
}

export default LandingPage