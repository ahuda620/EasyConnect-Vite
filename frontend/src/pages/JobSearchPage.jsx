import styles from "./JobSearchPage.module.css";
import SearchBar from "../components/SearchBar";
import JobListingCard from "../components/JobListingCard";
import JobListingDetail from "../components/JobListingDetail";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchJobListings from "../util/fetchJobListings";
import fetchUserSkills from "../util/fetchUserSkills";

export default function JobSearchPage() {
  const [searchParamObject, setSearchParamObject] = useState(null);
  const [fetchJobs, setFetchJobs] = useState(false); //determines whether or not make an api request
  const [jobListings, setJobListings] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userSkills, setUserSkills] = useState(null);

  const { user } = useUser(); //Use Clerk hook to get current user

  //fetch job listings
  const {
    isPending: isJobListingPending,
    isError: isJobListingError,
    error: jobListingError,
    isSuccess: isJobListingSuccess,
    data: jobListingData,
  } = useQuery({
    queryKey: ["jobListings", searchParamObject],
    queryFn: () => fetchJobListings(searchParamObject),
    enabled: fetchJobs,
  });

  //handle job listing query states
  useEffect(() => {
    //have to use useEffect for TanStack Query states (expect isPending since it doesn't triger side effects) since theyre ascynchronus
    if (isJobListingSuccess) {
      handleJobListings(jobListingData);
      setFetchJobs(false);
    }

    if (isJobListingError) {
      console.log(jobListingError);
      setFetchJobs(false);
    }
  }, [isJobListingError, isJobListingSuccess, jobListingData, jobListingError]);

  if (isJobListingPending) {
    console.log("Loading job listings...");
  }

  //fetch user skills
  const {
    isPending: isUserSkillsPending,
    isError: isUserSkillsError,
    error: userSkillsError,
    isSuccess: isUserSkillsSuccess,
    data: userSkillsData,
  } = useQuery({
    queryKey: ["userSkills", user?.id],
    queryFn: () => fetchUserSkills(user?.id),
    enabled: Boolean(user),
  });

  //handle user skills query states
  useEffect(() => {
    if (isUserSkillsSuccess) {
      setUserSkills(userSkillsData.data);
      console.log(userSkills);
    }

    if (isUserSkillsError) {
      console.log(userSkillsError);
    }
  }, [
    isUserSkillsError,
    isUserSkillsSuccess,
    userSkills,
    userSkillsData,
    userSkillsError,
  ]);

  if (isUserSkillsPending) {
    console.log("Loading user skills...");
  }

  const handleSearchParamObject = useCallback((searchParamObject) => {
    setSearchParamObject(searchParamObject);
  }, []);

  const handleFetchJobs = useCallback((fetchJobs) => {
    setFetchJobs(fetchJobs);
  }, []);

  function handleJobListings(jobListings) {
    setJobListings(jobListings);
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
            <JobListingCard
              userSkills={userSkills}
              searchParamObject={searchParamObject}
              jobListings={jobListings}
              handleJobSelect={handleJobSelect}
            ></JobListingCard>
            <JobListingDetail
              userSkills={userSkills}
              selectedJob={selectedJob}
            ></JobListingDetail>
          </section>
        )}
      </div>
    </>
  );
}
