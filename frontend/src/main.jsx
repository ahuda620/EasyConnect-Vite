import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import RootLayout from "./layouts/RootLayout";
import MobileProvider from "./context/MobileContext";
import HomePage from "./pages/HomePage";
import JobSearchPage from "./pages/JobSearchPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/jobs", element: <JobSearchPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MobileProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </MobileProvider>
    </QueryClientProvider>
  </StrictMode>
);
