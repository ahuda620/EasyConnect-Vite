import styles from "./HomePage.module.css";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  return (
    <>
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
        <div className={styles.searchBarWrapper}>
          <SearchBar></SearchBar>
        </div>
      </div>
    </>
  );
}
