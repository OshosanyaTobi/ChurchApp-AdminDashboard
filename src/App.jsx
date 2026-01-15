import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/ThemeProvider";
import { StateProvider } from "@/contexts/StateContext";

import Layout from "@/routes/layout";
import DashboardPage from "@/pages/dashboard";
import Blogs from "@/pages/blogslist";
import Login from "@/pages/login";
import WatchSection from "@/pages/watchsection";
import ProtectedRoute from "@/components/ProtectedRoute";
import Events from "@/pages/eventsection";
import AudioFile from "@/pages/audiofiles";
import Logout from "./pages/Logout";

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
        { index: true, element: <DashboardPage /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "blogs", element: <Blogs /> },
        { path: "watchsection", element: <WatchSection /> },
        { path: "eventsection", element: <Events /> },
        { path: "audiofiles", element: <AudioFile /> },
        { path: "settings", element: <h1 className="title">Settings</h1> },
        { path: "logout", element: <Logout /> },
      ],
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <StateProvider>
        <RouterProvider router={router} />
      </StateProvider>
    </ThemeProvider>
  );
}

export default App;
