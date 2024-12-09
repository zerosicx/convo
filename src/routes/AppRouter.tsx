import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Pages
import Dashboard from "@/pages/Dashboard";
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
                    <Route index element={<Dashboard />} />
                </Route>

                {/* Catch-All Route for 404 */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
