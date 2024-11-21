import styles from "./HomePage.module.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../context/MobileContext";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const location = useLocation();
  const isMobile = useIsMobile();

  /*effect to fix homepage background not taking up full height on mobile*/
  useEffect(() => {
    if (isMobile && location.pathname === "/") {
      document.documentElement.classList.add("overflow-visible"); //make overflow visible on root element
      document.body.classList.add("overflow-visible");
    } else {
      document.documentElement.classList.remove("overflow-visible"); //make overflow visible on root element
      document.body.classList.remove("overflow-visible");
    }
  }, [isMobile, location.pathname]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.heroContainer}>
        <h1 className={styles.heroTitle}>
          Easy Connect
          <br /> Your Next Job, Simplified.
        </h1>
        <h2 className={styles.heroText}>
          Find jobs that match your skills.
          <br /> Connect with top employers and grow your career.
        </h2>
      </div>

      <SearchBar></SearchBar>
    </div>
  );
}
