import styles from "./SavedJobsPage.module.css";
import JobListingCard from "../components/JobListingCard";
import JobListingDetail from "../components/JobListingDetail";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import { toast } from "react-toastify";
import fetchSavedJobIds from "../util/fetchSavedJobIds";
import fetchJobDetails from "../util/fetchJobDetails";
import fetchUserSkills from "../util/fetchUserSkills";
import deleteSavedJobId from "../util/deleteSavedJobId";
import { useIsMobile } from "../context/MobileContext";

export default function SavedJobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { user } = useUser(); //Use Clerk hook to get current user
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  //Fetch user skills
  const { isError: isUserSkillsError, data: userSkillsData } = useQuery({
    queryKey: ["userSkills", user?.id],
    queryFn: () => fetchUserSkills(user?.id),
    enabled: !!user?.id,
  });

  //Fetch saved job listing ids
  const {
    isError: isSavedJobIdsError,
    isFetching: isSavedJobIdsFetching,
    isSuccess: isSavedJobIdsSuccess,
    data: savedJobIdsData,
  } = useQuery({
    queryKey: ["savedJobIds", user?.id],
    queryFn: () => fetchSavedJobIds(user?.id),
    enabled: !!user?.id,
  });

  const jobDetailQueries = useQueries({
    queries:
      savedJobIdsData?.map((jobId) => {
        return {
          queryKey: ["jobDetails", jobId],
          queryFn: () => fetchJobDetails(jobId),
          enabled: !!jobId,
          staleTime: Infinity,
          cacheTime: 60 * 60 * 1000, //1 hour
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchOnMount: false,
          retry: false,
        };
      }) || [],
  });

  const jobDetailsDataArray = jobDetailQueries.map((query) => query.data);

  const jobDetailsData = useMemo(() => {
    return jobDetailQueries
      .map((query) => query.data)
      .filter(Boolean)
      .flat();
  }, [jobDetailsDataArray]);

  const isJobDetailsFetching = jobDetailQueries.some(
    (query) => query.isFetching
  );
  const isJobDetailsError = jobDetailQueries.some((query) => query.isError);
  const isJobDetailsFinished = jobDetailQueries.every(
    (query) => query.isSuccess || query.isError
  );

  //Delete user's saved job id in database
  const mutation = useMutation({
    mutationFn: (jobId) => deleteSavedJobId(user?.id, jobId),
    onSuccess: () => {
      toast.success("Job successfuly deleted.");
      queryClient.refetchQueries({ queryKey: ["savedJobIds", user?.id] });
    },
    onError: () => {
      toast.error("Failed to delete job.");
    },
  });

  //Prop function to pass down to JobListingCard to initiate mutation when user clicks delete button
  const handleDeleteJobId = (jobId) => {
    mutation.mutate(jobId);
  };

  //Effect to handle userSkills query error state
  useEffect(() => {
    if (isUserSkillsError) {
      toast.error("An error occured while fetching user skills.");
    }
  }, [isUserSkillsError]);

  useEffect(() => {
    if (isSavedJobIdsSuccess && savedJobIdsData?.length > 0) {
      setSelectedJob(null);
      // console.log(savedJobIdsData);
      // jobDetailQueries.forEach((query) => {
      //   console.log("Query Key:", query.queryKey);
      //   const cachedData = queryClient.getQueryData(query.queryKey);
      //   console.log(cachedData);

      //   if (!cachedData) {
      //     console.log("refetching");
      //     query.refetch();
      //   }
      // });
    }
  }, [isSavedJobIdsSuccess, savedJobIdsData]);

  //Effect to handle savedJobIds query error state
  useEffect(() => {
    if (isSavedJobIdsError) {
      toast.error("An error occured while fetching saved jobs.");
    }
  }, [isSavedJobIdsError]);

  useEffect(() => {
    if (!selectedJob && isJobDetailsFinished && jobDetailsData.length > 0) {
      setSelectedJob(jobDetailsData[0]);
    }
  }, [isJobDetailsFinished, jobDetailsData, selectedJob]);

  useEffect(() => {
    if (isJobDetailsError) {
      toast.error("An error occured while fetching saved jobs.");
    }
  }, [isJobDetailsError]);

  //Prop function to pass down to JobListingCard to update the ui whenever the user selects a job
  const handleJobSelect = useCallback(
    (job) => {
      setSelectedJob(job);
      if (isMobile) {
        setShowDetails(true);
        window.scrollTo(0, 0);
      }
    },
    [isMobile]
  );

  function handleBacktoJobListings() {
    setShowDetails(false);
  }

  return (
    <div className={styles.pageWrapper}>
      {isJobDetailsFinished && jobDetailsData?.length > 0 ? (
        <section className={styles.jobSectionWrapper}>
          <JobListingCard
            className={`${isMobile && showDetails ? styles.hidden : ""}`} //passing className prop to control toggle visiblity of this component on mobile
            userSkills={userSkillsData}
            jobListings={jobDetailsData}
            selectedJob={selectedJob}
            handleJobSelect={handleJobSelect}
            handleDeleteJobId={handleDeleteJobId}
          ></JobListingCard>
          <JobListingDetail
            className={`${isMobile && !showDetails ? styles.hidden : ""}`} //passing className prop to control toggle visiblity of this component on mobile
            userSkills={userSkillsData}
            selectedJob={selectedJob}
            handleBacktoJobListings={handleBacktoJobListings}
          ></JobListingDetail>
        </section>
      ) : isJobDetailsFetching || isSavedJobIdsFetching ? (
        <BounceLoader color="#f43f7f" className={styles.loadingAnimation} />
      ) : (
        <div className={styles.notFoundWrapper}>
          <h4 className={styles.notFoundHeaderText}>No saved jobs found.</h4>
          <p className={styles.notFoundSubText}>
            Add some from the{" "}
            <Link to="/jobs" className={styles.link}>
              Job Search Page!
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
