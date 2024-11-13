import styles from "./SavedJobsPage.module.css";
import JobListingCard from "../components/JobListingCard";
import JobListingDetail from "../components/JobListingDetail";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import fetchSavedJobIds from "../util/fetchSavedJobIds";
import fetchJobDetails from "../util/fetchJobDetails";
import fetchUserSkills from "../util/fetchUserSkills";
import deleteSavedJobId from "../util/deleteSavedJobId";

export default function SavedJobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  const { user } = useUser(); //Use Clerk hook to get current user
  const queryClient = useQueryClient();

  //Fetch user skills
  const {
    isError: isUserSkillsError,
    error: userSkillsError,
    data: userSkillsData,
  } = useQuery({
    queryKey: ["userSkills", user?.id],
    queryFn: () => fetchUserSkills(user?.id),
    enabled: !!user?.id,
  });

  //Fetch saved job listing ids
  const {
    isError: isSavedJobIdsError,
    error: savedJobIdsError,
    isSuccess: isSavedJobIdsSuccess,
    isFetching: isSavedJobIdsFetching,
    data: savedJobIdsData,
  } = useQuery({
    queryKey: ["savedJobIds", user?.id],
    queryFn: () => fetchSavedJobIds(user?.id),
    enabled: !!user?.id,
  });

  //Fetch job details
  const {
    isPending: isJobDetailsPending,
    isError: isJobDetailsError,
    error: jobDetailsError,
    isSuccess: isJobDetailsSuccess,
    isFetching: isJobDetailsFetching,
    isLoading: isJobDetailsLoading,
    data: jobDetailsdata,
    refetch: refetchJobDetails,
  } = useQuery({
    queryKey: ["jobs", user?.id, savedJobIdsData],
    queryFn: () => fetchJobDetails(savedJobIdsData),
    enabled: false,
  });

  //Delete user's saved job id in database
  const mutation = useMutation({
    mutationFn: (jobId) => deleteSavedJobId(user?.id, jobId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["savedJobIds", user?.id] });
    },
  });

  //Prop function to pass down to JobListingCard to initiate mutation when user clicks delete button
  const handleDeleteJobId = (jobId) => {
    mutation.mutate(jobId);
  };

  //Effect to handle userSkills query states
  useEffect(() => {
    if (isUserSkillsError) {
      console.log("Error fetching user skills:", userSkillsError); //TODO: add ui feedback
    }
  }, [isUserSkillsError, userSkillsError]);

  //Effect to handle savedJobIds query states
  useEffect(() => {
    if (isSavedJobIdsSuccess && savedJobIdsData?.length > 0) {
      refetchJobDetails(); //trigger job details fetch once the saved job ids are loaded by the first query
    }

    if (isSavedJobIdsError) {
      console.log("Error fetching saved job ids:", savedJobIdsError);
    }
  }, [
    isSavedJobIdsError,
    isSavedJobIdsSuccess,
    refetchJobDetails,
    savedJobIdsData,
    savedJobIdsError,
  ]);

  //Effect to handle jobDetails query states
  useEffect(() => {
    if (isJobDetailsLoading) {
      console.log("Loading jobs"); // TODO: change to loading animation
    }

    if (isJobDetailsError) {
      console.log("Error fetching jobs:", jobDetailsError); //TODO: add ui feedback
    }
  }, [isJobDetailsError, isJobDetailsLoading, jobDetailsError]);

  //Effect to display the first job listing in JobListingDetails component on initial page load
  useEffect(() => {
    if (isJobDetailsSuccess && jobDetailsdata?.length > 0) {
      setSelectedJob(jobDetailsdata[0]);
    }
  }, [isJobDetailsSuccess, jobDetailsdata]);

  //Prop function to pass down to JobListingCard to update the ui whenever the user selects a job
  function handleJobSelect(job) {
    setSelectedJob(job);
  }

  return (
    <>
      <div className={styles.pageWrapper}>
        {jobDetailsdata?.length > 0 ? (
          <section className={styles.jobSectionWrapper}>
            <JobListingCard
              userSkills={userSkillsData}
              jobListings={jobDetailsdata}
              handleJobSelect={handleJobSelect}
              handleDeleteJobId={handleDeleteJobId}
            ></JobListingCard>
            <JobListingDetail
              userSkills={userSkillsData}
              selectedJob={selectedJob}
            ></JobListingDetail>
          </section>
        ) : isJobDetailsLoading && isJobDetailsFetching ? (
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
    </>
  );
}
