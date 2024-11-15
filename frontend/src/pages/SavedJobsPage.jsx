import styles from "./SavedJobsPage.module.css";
import JobListingCard from "../components/JobListingCard";
import JobListingDetail from "../components/JobListingDetail";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import { toast } from "react-toastify";
import fetchSavedJobIds from "../util/fetchSavedJobIds";
import fetchJobDetails from "../util/fetchJobDetails";
import fetchUserSkills from "../util/fetchUserSkills";
import deleteSavedJobId from "../util/deleteSavedJobId";

export default function SavedJobsPage() {
  const [jobListings, setJobListings] = useState([]);
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
    isLoading: isSavedJobIdsLoading,
    isFetching: isSavedJobIdsFetching,
    isSuccess: isSavedJobIdsSuccess,
    data: savedJobIdsData,
  } = useQuery({
    queryKey: ["savedJobIds", user?.id],
    queryFn: () => fetchSavedJobIds(user?.id),
    enabled: !!user?.id,
  });

  //Fetch job details
  const {
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
    onSuccess: (data, jobId) => {
      toast.success("Job successfuly deleted.");
      setJobListings((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      queryClient.refetchQueries({ queryKey: ["savedJobIds", user?.id] });
    },
    onError: (error) => {
      toast.error("Failed to delete job.");
      console.error("Failed to delete job:", error);
    },
  });

  //Prop function to pass down to JobListingCard to initiate mutation when user clicks delete button
  const handleDeleteJobId = (jobId) => {
    mutation.mutate(jobId);
  };

  //Effect to handle userSkills query error state
  useEffect(() => {
    if (isUserSkillsError) {
      console.error("Error while fetching user skills:", userSkillsError);
      toast.error("An error occured while fetching user skills.");
    }
  }, [isUserSkillsError, userSkillsError]);

  //Effect to handle savedJobIds query success state
  useEffect(() => {
    if (isSavedJobIdsSuccess && savedJobIdsData?.length > 0) {
      refetchJobDetails(); //trigger job details fetch once the saved job ids are loaded by the first query
    }
  }, [isSavedJobIdsSuccess, refetchJobDetails, savedJobIdsData]);

  //Effect to handle savedJobIds query error state
  useEffect(() => {
    if (isSavedJobIdsError) {
      console.log("Error fetching saved job ids:", savedJobIdsError);
      toast.error("An error occured while fetching saved jobs from datbase.");
    }
  }, [isSavedJobIdsError, savedJobIdsError]);

  //Effect to handle jobDetails query error state
  useEffect(() => {
    if (isJobDetailsError) {
      console.log("Error fetching jobs:", jobDetailsError); //TODO: add ui feedback
      toast.error("An error occured while fetching jobs.");
    }
  }, [isJobDetailsError, jobDetailsError]);

  //Effect to display the first job listing in JobListingDetails component on initial page load
  useEffect(() => {
    if (isJobDetailsSuccess && jobDetailsdata?.length > 0) {
      setJobListings(jobDetailsdata);
      setSelectedJob(jobDetailsdata[0]);
    }
  }, [isJobDetailsSuccess, jobDetailsdata]);

  //Prop function to pass down to JobListingCard to update the ui whenever the user selects a job
  function handleJobSelect(job) {
    setSelectedJob(job);
  }

  return (
    <div className={styles.pageWrapper}>
      {jobDetailsdata?.length > 0 ? (
        <section className={styles.jobSectionWrapper}>
          <JobListingCard
            userSkills={userSkillsData}
            jobListings={jobListings}
            handleJobSelect={handleJobSelect}
            handleDeleteJobId={handleDeleteJobId}
          ></JobListingCard>
          <JobListingDetail
            userSkills={userSkillsData}
            selectedJob={selectedJob}
          ></JobListingDetail>
        </section>
      ) : isJobDetailsFetching || isSavedJobIdsFetching ? (
        <BounceLoader color="#f43f7f" className={styles.loadingAnimation} />
      ) : (
        !isJobDetailsLoading ||
        (!isSavedJobIdsLoading && (
          <div className={styles.notFoundWrapper}>
            <h4 className={styles.notFoundHeaderText}>No saved jobs found.</h4>
            <p className={styles.notFoundSubText}>
              Add some from the{" "}
              <Link to="/jobs" className={styles.link}>
                Job Search Page!
              </Link>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
