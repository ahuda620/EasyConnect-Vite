import { useState, useEffect, createContext, useContext } from "react";

const MobileContext = createContext();

export default function MobileProvider({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1092);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    //cleanup on dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MobileContext.Provider value={isMobile}>{children}</MobileContext.Provider>
  );
}

export function useIsMobile() {
  return useContext(MobileContext);
}
