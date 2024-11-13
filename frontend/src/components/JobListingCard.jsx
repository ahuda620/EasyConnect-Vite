import styles from "./JobListingCard.module.css";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import dateFormatter from "../util/dateFormatter";
import jobSkillsMatcher from "../util/jobSkillsMatcher";
import BounceLoader from "react-spinners/BounceLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faCity } from "@fortawesome/free-solid-svg-icons";

export default function JobListingCard({
  userSkills,
  searchParamObject,
  jobListings,
  handleJobSelect,
  handleDeleteJobId,
  handleSearchParamObject,
  handleFetchJobs,
  loading,
  noMoreJobListings,
}) {
  const [selectedJobId, setSelectedJobId] = useState(null);

  const { user } = useUser(); //Use Clerk hook to determine if a user is signed on
  const location = useLocation();

  //Effect to set selectedJobId state variable to the job_id of the first job listing fetched
  useEffect(() => {
    if (jobListings.length > 0) {
      setSelectedJobId(jobListings[0].job_id);
    }
  }, [jobListings]);

  //Function that handles a job card click by applying styles and sending the corresponding job listing info back to the parent component
  function handleJobCardClick(jobListing) {
    setSelectedJobId(jobListing.job_id); //update state
    handleJobSelect(jobListing); //send joblisting info back to parent component
  }

  //Effect to track if the user has scrolled to the bottom of jobListingCardWrapper element for lazyloading
  useEffect(() => {
    if (location.pathname === "/jobs" && searchParamObject) {
      const jobListingCardWrapper = document.querySelector(
        `.${styles.jobListingCardWrapper}`
      );

      if (jobListingCardWrapper && !noMoreJobListings) {
        const handleScroll = () => {
          if (
            jobListingCardWrapper.scrollHeight -
              jobListingCardWrapper.scrollTop ===
            jobListingCardWrapper.clientHeight
          ) {
            console.log("Bottom hit!");
            //Increment the page property of searchParamObject and trigger a new fectch in parent component
            const newPage = parseInt(searchParamObject.page) + 1;

            handleSearchParamObject({
              ...searchParamObject,
              page: newPage.toString(),
            });

            handleFetchJobs(true, true);
          }
        };

        jobListingCardWrapper.addEventListener("scroll", handleScroll);

        //Clean up scroll event listener on unmount
        return () =>
          jobListingCardWrapper.removeEventListener("scroll", handleScroll);
      }
    }
  }, [
    handleFetchJobs,
    handleSearchParamObject,
    location.pathname,
    noMoreJobListings,
    searchParamObject,
  ]);

  return (
    <div className={styles.jobListingsWrapper}>
      <div className={styles.jobSearchQueryHeader}>
        <h4>
          {location.pathname === "/saved-jobs"
            ? "Saved jobs"
            : /* Conditionally render text in jobSearchQueryHeader element depending on 
          if jobSearchTerm and locationSearchTerm are provided by the user */
            searchParamObject.jobSearchTerm &&
              searchParamObject.locationSearchTerm
            ? `${searchParamObject.jobSearchTerm} jobs in ${searchParamObject.locationSearchTerm}`
            : searchParamObject.jobSearchTerm
            ? `${searchParamObject.query} jobs`
            : searchParamObject.locationSearchTerm
            ? `Jobs in ${searchParamObject.query}`
            : ""}
        </h4>
      </div>
      <div className={styles.jobListingCardWrapper}>
        {jobListings.map((jobListing, index) => {
          jobListing.posted_date_formatted = dateFormatter(jobListing); //format the job posted date
          let matchedSkills; //display if theres any user skills matching with the job description

          if (user && userSkills) {
            matchedSkills = jobSkillsMatcher(
              userSkills,
              jobListing.job_description
            );
          }

          return (
            <article
              // key={jobListing.job_id}
              key={`${jobListing.job_id}-${index}`} //for lazy loading testing
              onClick={() => {
                handleJobCardClick(jobListing);
              }}
              className={`${styles.jobListingCard} ${
                selectedJobId === jobListing.job_id ? styles.clicked : ""
              }`}
            >
              {jobListing.employer_logo ? (
                <img
                  src={jobListing.employer_logo}
                  className={styles.employerLogo}
                ></img>
              ) : (
                <FontAwesomeIcon
                  icon={faCity}
                  className={styles.employerLogoPlaceholder}
                />
              )}
              <div className={styles.jobDetailsWrapper}>
                {location.pathname === "/saved-jobs" && (
                  <span className={styles.faXmarkWrapper}>
                    <button
                      onClick={() => {
                        handleDeleteJobId(jobListing.job_id);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        className={styles.faXmark}
                      />
                    </button>
                  </span>
                )}
                <h3 className={styles.jobListingTitle}>
                  {jobListing.job_title}
                </h3>
                <p className={styles.jobListingEmployerName}>
                  {jobListing.employer_name}
                </p>
                <p className={styles.jobListingLocation}>
                  {`${
                    jobListing.job_city && jobListing.job_state
                      ? `${jobListing.job_city}, ${jobListing.job_state}`
                      : jobListing.job_city
                      ? `${jobListing.job_city}, ${jobListing.job_country}`
                      : jobListing.job_state
                      ? `${jobListing.job_state}, ${jobListing.job_country}`
                      : jobListing.job_country
                  }`}
                </p>

                <ul className={styles.jobListingKeywords}>
                  <li>
                    {jobListing.job_employment_type &&
                    jobListing.job_employment_type === "FULLTIME"
                      ? "Full-time"
                      : jobListing.job_employment_type === "PARTTIME"
                      ? "Part-time"
                      : jobListing.job_employment_type === "CONTRACTOR"
                      ? "Contractor"
                      : jobListing.job_employment_type === "INTERN"
                      ? "Internship"
                      : ""}
                  </li>
                  {jobListing.job_is_remote && <li>Remote</li>}
                  {matchedSkills &&
                    matchedSkills.slice(0, 4).map((skill) => (
                      <li key={skill} className={styles.matchedSkills}>
                        {/* Captilize first letter of each word of matched skill */}
                        {skill
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={styles.faCheck}
                        />
                      </li>
                    ))}
                  {matchedSkills && matchedSkills.length > 4 && (
                    <li className={styles.additionalSkills}>
                      +{matchedSkills.length - 4}
                    </li>
                  )}
                </ul>

                <ul className={styles.jobListingPreviewText}>
                  {jobListing.job_highlights &&
                  jobListing.job_highlights.Responsibilities &&
                  jobListing.job_highlights.Responsibilities.length >= 4 ? (
                    jobListing.job_highlights.Responsibilities.map(
                      (listItem, index) => <li key={index}>{listItem}</li>
                    )
                  ) : jobListing.job_highlights.Qualifications &&
                    jobListing.job_highlights.Qualifications.length >= 4 ? (
                    jobListing.job_highlights.Qualifications.map(
                      (listItem, index) => <li key={index}>{listItem}</li>
                    )
                  ) : (
                    <li>{jobListing.job_description}</li>
                  )}
                </ul>
                <p className={styles.jobListingPostedDate}>
                  {jobListing.posted_date_formatted}
                </p>
              </div>
            </article>
          );
        })}
        {loading && jobListings.length > 0 && (
          <BounceLoader color="#f43f7f" className={styles.loadingAnimation} />
        )}
        {noMoreJobListings && !loading && (
          <h2 className={styles.noJobsFoundText}>
            No job listings found. <br />
            Please try different search criteria
          </h2>
        )}
      </div>
    </div>
  );
}
