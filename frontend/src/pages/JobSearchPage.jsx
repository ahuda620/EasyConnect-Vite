import styles from "./JobSearchPage.module.css";
import SearchBar from "../components/SearchBar";
import JobListingCard from "../components/JobListingCard";
import JobListingDetail from "../components/JobListingDetail";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchJobListings from "../util/fetchJobListings";
import fetchUserSkills from "../util/fetchUserSkills";
import { useLocation, useNavigate } from "react-router-dom";

export default function JobSearchPage() {
  const [isInitialSearch, setIsInitialSearch] = useState(true);
  const [initialJobSearchTerm, setInitialJobSearchTerm] = useState("");
  const [initialLocationSearchTerm, setInitialLocationSearchTerm] =
    useState("");
  const [searchParamObject, setSearchParamObject] = useState(null);
  const [fetchJobs, setFetchJobs] = useState(false); //determines whether or not make an api request
  const [jobListings, setJobListings] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userSkills, setUserSkills] = useState(null);

  const { user } = useUser(); //Use Clerk hook to get current user
  const location = useLocation();
  const navigate = useNavigate();

  //effect to determine if its the initial search for the page, if so use search params to fetch jobs on page load
  useEffect(() => {
    if (isInitialSearch) {
      const params = new URLSearchParams(location.search);

      const jobSearchTerm = params.get("query");
      const locationSearchTerm = params.get("location");

      setInitialJobSearchTerm(jobSearchTerm);
      setInitialLocationSearchTerm(locationSearchTerm);

      if (jobSearchTerm || locationSearchTerm) {
        setSearchParamObject({
          query: [jobSearchTerm, locationSearchTerm]
            .filter(Boolean)
            .join(" in "),
          jobSearchTerm,
          locationSearchTerm,
          page: "1",
          num_pages: "1",
          date_posted: "all",
          markup_job_description: "true",
        });

        setFetchJobs(true);
      }

      setIsInitialSearch(false); //ensure this effect only runs once
    }
  }, [
    location.search,
    isInitialSearch,
    initialJobSearchTerm,
    initialLocationSearchTerm,
  ]);

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

  //display the first job listing in jobListingDetails component on initial page load
  useEffect(() => {
    if (isJobListingSuccess && jobListingData.length > 0) {
      setSelectedJob(jobListingData[0]);
    }
  }, [isJobListingSuccess, jobListingData]);

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
    enabled: !!user?.id,
  });

  //handle user skills query states
  useEffect(() => {
    if (isUserSkillsSuccess) {
      setUserSkills(userSkillsData);
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

  //update searchParamObject and url query params
  const handleSearchParamObject = useCallback(
    (searchParamObject) => {
      setSearchParamObject(searchParamObject);

      const params = new URLSearchParams();
      if (searchParamObject.jobSearchTerm) {
        params.set("query", searchParamObject.jobSearchTerm);
      }
      if (searchParamObject.locationSearchTerm) {
        params.set("location", searchParamObject.locationSearchTerm);
      }

      navigate(`/jobs?${params.toString()}`, { replace: true });
    },
    [navigate]
  );

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
            initialJobSearchTerm={initialJobSearchTerm || ""}
            initialLocationSearchTerm={initialLocationSearchTerm || ""}
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
