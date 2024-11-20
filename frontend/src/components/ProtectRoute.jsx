import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function ProtectRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (isLoaded && !isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
