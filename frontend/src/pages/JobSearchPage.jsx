import styles from "./JobSearchPage.module.css";
import SearchBar from "../components/SearchBar";
import JobListingCard from "../components/JobListingCard";
import JobListingDetail from "../components/JobListingDetail";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchJobListings from "../util/fetchJobListings";

export default function JobSearchPage() {
  const [searchParamObject, setSearchParamObject] = useState(null);
  const [fetchJobs, setFetchJobs] = useState(false); //determines whether or not make an api request
  const [jobListings, setJobListings] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const { isPending, isError, error, isSuccess, data } = useQuery({
    queryKey: ["jobListings".searchParamObject],
    queryFn: () => fetchJobListings(searchParamObject),
    enabled: fetchJobs,
  });

  useEffect(() => {
    //have to use useEffect for TanStack Query states (expect isPending since it doesn't triger side effects) since theyre ascynchronus
    if (isSuccess) {
      handleJobListings(data);
      setFetchJobs(false);
    }

    if (isError) {
      console.log(error);
      setFetchJobs(false);
    }
  }, [data, error, isError, isSuccess]);

  if (isPending) {
    console.log("Loading...");
  }

  const handleSearchParamObject = useCallback((searchParamObject) => {
    setSearchParamObject(searchParamObject);
  }, []);

  const handleFetchJobs = useCallback((fetchJobs) => {
    setFetchJobs(fetchJobs);
  }, []);

  function handleJobListings(jobListings) {
    setJobListings(jobListings);
    console.log(jobListings);
  }

  function handleJobSelect(job) {
    setSelectedJob(job);
  }

  return (
    <>
      <div className={styles.pageWrapper}>
        <section className={styles.searchSectionWrapper}>
          <SearchBar
            handleSearchParamObject={handleSearchParamObject}
            handleFetchJobs={handleFetchJobs}
          ></SearchBar>
        </section>
        {jobListings && (
          <section className={styles.jobSectionWrapper}>
            <div className={styles.jobPageListingCardWrapper}>
              <JobListingCard
                jobListings={jobListings}
                handleJobSelect={handleJobSelect}
              ></JobListingCard>
            </div>
            <JobListingDetail selectedJob={selectedJob}></JobListingDetail>
          </section>
        )}
      </div>
    </>
  );
}
