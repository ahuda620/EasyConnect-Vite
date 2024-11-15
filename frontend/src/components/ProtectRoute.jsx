import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function ProtectRoute({ children }) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
