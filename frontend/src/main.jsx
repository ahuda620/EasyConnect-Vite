import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import RootLayout from "./layouts/RootLayout";
import ProtectRoute from "./components/ProtectRoute";
import MobileProvider from "./context/MobileContext";
import HomePage from "./pages/HomePage";
import JobSearchPage from "./pages/JobSearchPage";
import SkillsPage from "./pages/SkillsPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import ErrorPage from "./pages/ErrorPage";
import JobListingDetail from "./components/JobListingDetail";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/jobs", element: <JobSearchPage /> },
      { path: "/jobs/details", element: <JobListingDetail /> },
      {
        path: "/skills",
        element: (
          <ProtectRoute>
            <SkillsPage />
          </ProtectRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectRoute>
            <SavedJobsPage />
          </ProtectRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MobileProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={1500}
          theme="dark"
          style={{ marginTop: "3%" }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </MobileProvider>
    </QueryClientProvider>
  </StrictMode>
);
