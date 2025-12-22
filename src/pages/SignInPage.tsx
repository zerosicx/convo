import { SignIn } from "@clerk/clerk-react";
import convoLogo from "@/assets/convo-logo-192.png";
import { NavLink } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="flex flex-col items-center gap-6">
        <NavLink to="/" className="flex flex-row items-center gap-0">
          <img src={convoLogo} className="w-12" alt="Convo logo" />
          <h1 className="text-4xl font-bold text-white">onvo</h1>
        </NavLink>
        <p className="text-zinc-400">Sign in to access your notes</p>
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/app"
        />
      </div>
    </div>
  );
};

export default SignInPage;

