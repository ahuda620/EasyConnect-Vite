import styles from "./JobSearchPage.module.css";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import JobListingCard from "../components/JobListingCard";

export default function JobSearchPage() {
  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        <section className={styles.searchSectionWrapper}>
          <div className={styles.searchBarWrapper}>
            <SearchBar></SearchBar>
          </div>
          <div className={styles.sortButtonsWrapper}>
            <button>Placeholder</button>
            <button>Placeholder</button>
            <button>Placeholder</button>
            <button>Placeholder</button>
            <button>Placeholder</button>
            <button>Placeholder</button>
            <button>Placeholder</button>
            <button>Placeholder</button>
            <button>Placeholder</button>
            <button>Placeholder</button>
          </div>
        </section>
        <JobListingCard></JobListingCard>

        {/* <div className={styles.jobListingDetailPanelWrapper}></div> */}
      </div>
    </>
  );
}
