import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MobileProvider from "./context/MobileContext";
import HomePage from "./pages/HomePage";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MobileProvider>
      <RouterProvider router={router} />
    </MobileProvider>
  </StrictMode>
);
