import conversationImage from "@/assets/conversation.webp";
import convoLogo from "@/assets/convo-logo-192.png";
import { Button } from "@/components/ui/Button";
import { NavLink } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-zinc-50">
      <div className="flex flex-row justify-between fixed top-0 h-16 items-center gap-2 w-full px-4 py-2 bg-brand-background z-20 text-primary-foreground">
        <NavLink to="/" className="flex flex-row gap-0">
          <img src={convoLogo} className="w-10" />
          <h2 className="text-3xl font-bold">onvo</h2>
        </NavLink>
        <div>
          <NavLink to="/app">
            <Button variant="brand">Get Convo</Button>
          </NavLink>
        </div>
      </div>
      <div className="flex flex-row lg:gap-[150px] sm:gap-4 flex-wrap items-center justify-center md:mt-10 lg:m-0">
        <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
          <h2 className="text-3xl font-italic">
            Simple notes, seamless thoughts.
          </h2>
          <h1 className="text-4xl font-semibold">
            Welcome to <span className="text-brand font-bold">Convo</span>.
          </h1>
          <div className="flex flex-row gap-2">
            <NavLink to="/app">
              <Button size="lg" variant="brand">
                Get Convo
              </Button>
            </NavLink>
            <NavLink to="/about">
              <Button size="lg" variant="secondary">
                Learn more
              </Button>
            </NavLink>
          </div>
        </div>
        <img
          src={conversationImage}
          className="rounded-md drop-shadow-md w-[50%] md:w-[50%] lg:w-[25%]"
        />
      </div>
    </div>
  );
};

export default LandingPage;
