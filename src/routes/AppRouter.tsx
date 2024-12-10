import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { Outlet, Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Pages
import ErrorPage from "@/pages/ErrorPage";
import LandingPage from "@/pages/LandingPage";

// Layout
import MainLayout from "@/layouts/MainLayout";

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Application Dashboard */}
                <Route path="/app" element={<MainLayout />}>
                    <Route index element={<Outlet />} />
                    <Route path="notebook/:notebookId" element={<Outlet />} >
                        <Route path="section/:sectionId" element={<Outlet />}>
                            <Route path="page/:pageId" element={<Outlet />} />
                        </Route>
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
