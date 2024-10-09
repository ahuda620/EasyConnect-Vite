import styles from "./HomePage.module.css";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  return (
    <>
      <Header></Header>
      <div className={styles.pageWrapper}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            Lorem ipsum dolor
            <br /> sit amet.
          </h1>
          <h2 className={styles.heroText}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            <br /> Nisi mollitia error eum itaque voluptatem ea!
          </h2>
        </div>
        <div className={styles.searchBarWrapper}>
          <SearchBar></SearchBar>
        </div>
      </div>
    </>
  );
}
