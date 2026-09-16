import Dashboard from "@/pages/Dashboard";
import ExportPage from "@/pages/Export";
import History from "@/pages/History";
import Insights from "@/pages/Insights";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResumeDetail from "@/pages/ResumeDetail";
import Resumes from "@/pages/Resumes";
import Settings from "@/pages/Settings";
import Versions from "@/pages/Versions";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { ProtectedShell } from "./pages/ProtectedShell";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <ProtectedShell />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "resumes", element: <Resumes /> },
      { path: "resumes/:id", element: <ResumeDetail /> },
      { path: "resumes/:id/export", element: <ExportPage /> },
      { path: "insights", element: <Insights /> },
      { path: "versions", element: <Versions /> },
      { path: "history", element: <History /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
