import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { StateProvider } from "@/contexts/StateContext";
import { Toaster } from "react-hot-toast"; // ✅ import

import Layout from "@/routes/layout";
import DashboardPage from "@/pages/dashboard";
import Blogs from "@/pages/blogslist";
import Login from "@/pages/login";
import WatchSection from "@/pages/watchsection";
import ProtectedRoute from "@/components/ProtectedRoute";
import Events from "@/pages/eventsection";
import AudioFile from "@/pages/audiofiles";
import Logout from "./pages/Logout";
import AdminRoleCreate from "./pages/adminrolecreate";
import AdminCreateSchedule from "./pages/admincreateschedule";
import AdminAnnouncementsCreate from "./pages/admincreateannouncements";
import AdminVolunteerReports from "./pages/adminvolunteerreports";
import Assignments from "./pages/assignments";
import SettingsPage from "./pages/settings";
import AdminWhatsApp from "./pages/adminwhatsapp";

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
        { path: "announcements", element: <AdminAnnouncementsCreate /> },
        { path: "blogs", element: <Blogs /> },
        { path: "watchsection", element: <WatchSection /> },
        { path: "eventsection", element: <Events /> },
        { path: "audiofiles", element: <AudioFile /> },
        { path: "roles", element: <AdminRoleCreate /> },
        { path: "assignments", element: <Assignments /> },
        { path: "whatsapp-links", element: <AdminWhatsApp /> },
        { path: "schedules", element: <AdminCreateSchedule /> },
        { path: "reports", element: <AdminVolunteerReports /> },
        { path: "settings", element: <SettingsPage/> },
        { path: "logout", element: <Logout /> },
      ],
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <StateProvider>
        <RouterProvider router={router} />
        <Toaster /> {/* ✅ Add Toaster here so all toast notifications work */}
      </StateProvider>
    </ThemeProvider>
  );
}

export default App;
