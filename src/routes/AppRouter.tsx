import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import React from "react";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";

// Pages
import ErrorPage from "@/pages/ErrorPage";
import LandingPage from "@/pages/LandingPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";

// Layout
import { Toaster } from "@/components/ui/Toaster";
import MainLayout from "@/layouts/MainLayout";
import AboutPage from "@/pages/AboutPage";

/**
 * Loading spinner for auth state
 */
const AuthLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-zinc-600 border-t-brand rounded-full animate-spin" />
      <p className="text-zinc-400">Loading...</p>
    </div>
  </div>
);

/**
 * Protected Route Wrapper
 * Uses Convex auth components (which properly wait for JWT validation)
 * Redirects to sign-in if user is not authenticated
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLoadingSpinner />
      </AuthLoading>
      <Unauthenticated>
        <Navigate to="/sign-in" replace />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Protected Application Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Outlet />} />
          <Route path="notebook/:notebookId" element={<Outlet />}>
            <Route path="section/:sectionId" element={<Outlet />}>
              <Route path="page/:pageId" element={<Outlet />} />
            </Route>
          </Route>
          <Route path="inbox" element={<Outlet />}>
            <Route path="page/:pageId" element={<Outlet />} />
          </Route>
          <Route path="pages" element={<Outlet />}>
            <Route path="page/:pageId" element={<Outlet />} />
          </Route>
        </Route>

        {/* Catch-All Route for 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default AppRouter;
