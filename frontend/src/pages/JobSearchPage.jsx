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
import BounceLoader from "react-spinners/BounceLoader";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function JobSearchPage() {
  const [isInitialSearch, setIsInitialSearch] = useState(true); //determines if its first search on the page
  const [initialSearchParamObject, setInitialSearchParamObject] =
    useState(null);
  const [searchParamObject, setSearchParamObject] = useState(null);
  const [fetchJobs, setFetchJobs] = useState(false); //determines whether or not make an api request
  const [appending, setAppending] = useState(false); //determines whether or not to append joblisting data to current jobListings state, or replace it for lazy loading
  const [jobListings, setJobListings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userSkills, setUserSkills] = useState(null);
  const [loading, setLoading] = useState(false); //Determines if loading circle animation is displayed
  const [noMoreJobListings, setNoMoreJobListings] = useState(false);

  const { user } = useUser(); //Use Clerk hook to get current user
  const location = useLocation();
  const navigate = useNavigate();

  //Fetch user skills
  const {
    isError: isUserSkillsError,
    error: userSkillsError,
    isSuccess: isUserSkillsSuccess,
    data: userSkillsData,
  } = useQuery({
    queryKey: ["userSkills", user?.id],
    queryFn: () => fetchUserSkills(user?.id),
    enabled: !!user?.id,
  });

  //Fetch job listings
  const {
    isLoading: isJobListingLoading,
    isError: isJobListingError,
    error: jobListingError,
    isSuccess: isJobListingSuccess,
    isFetching: isJobListingFetching,
    data: jobListingData,
  } = useQuery({
    queryKey: ["jobListings", searchParamObject],
    queryFn: () => fetchJobListings(searchParamObject),
    enabled: fetchJobs && searchParamObject !== null,
    staleTime: 60 * 60 * 1000, //1 hour
    cacheTime: 60 * 60 * 1000, //1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
  });

  const handleJobListings = useCallback(
    (newJobListings) => {
      if (appending) {
        // console.log("Appending jobs:", newJobListings.length);
        setJobListings((prevJobListings) => {
          const updatedListings = [...prevJobListings, ...newJobListings];
          // console.log("Previous length:", prevJobListings.length);
          // console.log("New total length:", updatedListings.length);
          return updatedListings;
        });
      } else {
        // console.log("Replacing job listings:", newJobListings.length);
        setJobListings(newJobListings);
      }
    },
    [appending]
  );

  //Effect to handle userSkills success state
  useEffect(() => {
    if (isUserSkillsSuccess) {
      setUserSkills(userSkillsData);
    }
  }, [isUserSkillsSuccess, userSkillsData]);

  //Effect to handle userSkills query error state
  useEffect(() => {
    if (isUserSkillsError) {
      console.error("Error while fetching user skills:", userSkillsError);
      toast.error("An error occured while fetching user skills.");
    }
  }, [isUserSkillsError, userSkillsError]);

  //Effect to handle jobListings success state
  useEffect(() => {
    if (isJobListingSuccess) {
      handleJobListings(jobListingData);
      setFetchJobs(false);
      setLoading(false);
    }
  }, [isJobListingSuccess, jobListingData]);

  //Effect to handle jobListings loading state
  useEffect(() => {
    if (isJobListingLoading) {
      setLoading(true); //state that is passed down to JobListingCard component
    }
  }, [isJobListingLoading]);

  //Effect to handle jobListings error state
  useEffect(() => {
    if (isJobListingError) {
      console.log(jobListingError);
      toast.error("An error occured while fetching jobs.");
      setFetchJobs(false);
      setLoading(false);
    }
  }, [isJobListingError, jobListingError]);

  //Effect to determine if its the initial search for the page, if so use search params to fetch jobs on page load
  //i.e. when the user initiates a search from the HomePage and is navigated here
  useEffect(() => {
    if (isInitialSearch) {
      const params = new URLSearchParams(location.search);
      const dataParam = params.get("data");

      if (dataParam) {
        const parsedSearchObject = JSON.parse(decodeURIComponent(dataParam));
        setInitialSearchParamObject(parsedSearchObject);
        setSearchParamObject(parsedSearchObject);
        setFetchJobs(true);
      }

      // setIsInitialSearch(false); //ensure this effect only runs once
      setTimeout(() => {
        setIsInitialSearch(false); //ensure this effect only runs once
      }, 0);
    }
  }, [isInitialSearch]);

  //Effect to display the first job listing in jobListingDetails component on initial page load
  useEffect(() => {
    if (isJobListingSuccess && jobListings?.length > 0) {
      setSelectedJob(jobListings[0]);
    }
  }, [isJobListingSuccess, jobListings]);

  //Effect to calculate if there are no more new jobListings to display, and there are previous job listings already displayed
  //Will display no more job listings UI message inside the JobListingCard component
  useEffect(() => {
    if (jobListings?.length > 0 && jobListingData?.length === 0) {
      setNoMoreJobListings(true);
    }
  }, [jobListingData?.length, jobListings?.length]);

  //update searchParamObject and url query params
  const handleSearchParamObject = useCallback((searchParamObject) => {
    setSearchParamObject(searchParamObject);

    const params = new URLSearchParams();
    if (searchParamObject.jobSearchTerm) {
      params.set("query", searchParamObject.jobSearchTerm);
    }
    if (searchParamObject.locationSearchTerm) {
      params.set("location", searchParamObject.locationSearchTerm);
    }

    navigate(`/jobs?${params.toString()}`, { replace: true });
  }, []);

  //Prop function that initiates a fetch for jobListings
  const handleFetchJobs = useCallback((fetchJobs, isAppending = false) => {
    if (!isAppending) {
      setJobListings([]);
    }
    setFetchJobs(fetchJobs); //initiate fetch
    setAppending(isAppending);
  }, []);

  //Prop function that handles which jobListing is displayed on in the jobListingDetails component
  function handleJobSelect(job) {
    setSelectedJob(job);
  }

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.searchSectionWrapper}>
        <SearchBar
          isInitialSearch={isInitialSearch}
          initialSearchParamObject={initialSearchParamObject}
          handleSearchParamObject={handleSearchParamObject}
          handleFetchJobs={handleFetchJobs}
        ></SearchBar>
      </section>
      {searchParamObject && jobListings?.length > 0 ? (
        <section className={styles.jobSectionWrapper}>
          <JobListingCard
            userSkills={userSkills}
            searchParamObject={searchParamObject}
            jobListings={jobListings}
            handleJobSelect={handleJobSelect}
            handleSearchParamObject={handleSearchParamObject}
            handleFetchJobs={handleFetchJobs}
            loading={loading}
            noMoreJobListings={noMoreJobListings}
          ></JobListingCard>
          <JobListingDetail
            userSkills={userSkills}
            selectedJob={selectedJob}
          ></JobListingDetail>
        </section>
      ) : searchParamObject &&
        !isJobListingFetching &&
        jobListings?.length === 0 &&
        jobListingData?.length === 0 ? (
        <h2 className={styles.noJobsFoundText}>
          No job listings found. <br />
          Please try different search criteria
        </h2>
      ) : (
        !isJobListingFetching && (
          <h2 className={styles.initialSearchText}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Begin your search here
          </h2>
        )
      )}
      {isJobListingLoading &&
        isJobListingFetching &&
        jobListings.length === 0 && (
          <BounceLoader color="#f43f7f" className={styles.loadingAnimation} />
        )}
    </div>
  );
}
