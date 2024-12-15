import React from "react";
import { Outlet, Route, HashRouter as Router, Routes } from "react-router-dom";

// Pages
import ErrorPage from "@/pages/ErrorPage";
import LandingPage from "@/pages/LandingPage";

// Layout
import { Toaster } from "@/components/ui/Toaster";
import MainLayout from "@/layouts/MainLayout";
import AboutPage from "@/pages/AboutPage";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* About page */}
        <Route path="/about" element={<AboutPage />} />

        {/* Application Dashboard */}
        <Route path="/app" element={<MainLayout />}>
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
