import styles from "./JobSearchPage.module.css";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import JobListingCard from "../components/JobListingCard";
import JobListingDetail from "../components/JobListingDetail";
import { useState } from "react";

export default function JobSearchPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  function handleJobSelect(job) {
    setSelectedJob(job);
  }

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
          </div>
        </section>
        <section className={styles.jobSectionWrapper}>
          <JobListingCard handleJobSelect={handleJobSelect}></JobListingCard>
          <JobListingDetail selectedJob={selectedJob}></JobListingDetail>
        </section>

        {/* <div className={styles.jobListingDetailPanelWrapper}></div> */}
      </div>
    </>
  );
}
