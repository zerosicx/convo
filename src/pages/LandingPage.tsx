import { Button } from "@/components/ui/Button"
import { NavLink } from "react-router-dom"

const LandingPage = () => {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex flex-row justify-between fixed top-0 h-16 items-center gap-2 w-full p-2">
                <h2 className="text-3xl font-bold">Mizu</h2>
                <div>
                    <NavLink to="/app">
                        <Button variant="mizu">Get Mizu</Button>
                    </NavLink>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl">Let your mind flow like water. <br /> Welcome to Mizu!</h1>
                <div className="flex flex-row gap-2">
                    <NavLink to="/app">
                        <Button size="lg" variant="mizu">Get Mizu</Button>
                    </NavLink>
                    <Button size="lg" variant="secondary">Learn more</Button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage