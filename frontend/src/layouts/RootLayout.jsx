import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Header from "../components/Header";

//Import Clerk Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <main className={isHomePage ? "preventOverflow" : ""}>
        <Header />
        <Outlet />
      </main>
    </ClerkProvider>
  );
}
