import { Button } from "@/components/ui/Button";
import { NavLink } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-white justify-center items-center gap-4">
      <h1 className="text-3xl font-bold">Sorry, no pages found here.</h1>
      <h2 className="text-2xl">Turn back now!</h2>
      <NavLink to="/">
        <Button>Go back 💃</Button>
      </NavLink>
    </div>
  );
};

export default ErrorPage;
