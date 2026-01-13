import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/pages/dashboard";
import Blogs from "@/pages/blogslist";
import Login from "@/pages/login";
import WatchSection from "./pages/watchsection";
import ProtectedRoute from "@/components/ProtectedRoute";
import Events from "./pages/eventsection";
import AudioFile from "./pages/audiofiles";

function App() {
    const router = createBrowserRouter([
        // 🔓 PUBLIC ROUTES
        {
            path: "/login",
            element: <Login />,
        },

        // 🔐 PROTECTED ADMIN ROUTES
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "dashboard",
                    element: <DashboardPage />,
                },
                {
                    index: true,
                    element: <DashboardPage />,
                },
                {
                    path: "blogs",
                    element: <Blogs />,
                },
                {
                    path: "watchsection",
                    element: <WatchSection />,
                },
                {
                    path: "eventsection",
                    element: <Events />,
                },
                {
                    path: "audiofiles",
                    element: <AudioFile />,
                },
                {
                    path: "customers",
                    element: <h1 className="title">Customers</h1>,
                },
                {
                    path: "new-customer",
                    element: <h1 className="title">New Customer</h1>,
                },
                {
                    path: "verified-customers",
                    element: <h1 className="title">Verified Customers</h1>,
                },
                {
                    path: "products",
                    element: <h1 className="title">Products</h1>,
                },
                {
                    path: "new-product",
                    element: <h1 className="title">New Product</h1>,
                },
                {
                    path: "inventory",
                    element: <h1 className="title">Inventory</h1>,
                },
                {
                    path: "settings",
                    element: <h1 className="title">Settings</h1>,
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
