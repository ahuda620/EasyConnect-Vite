import styles from "./JobListingCard.module.css";
import { useQuery } from "@tanstack/react-query";
import { getJobListings } from "../api/apis";

export default function JobListingCard() {
  const {
    isLoading: isJobListingsLoading,
    error: jobListingsError,
    data: jobListings,
  } = useQuery({
    queryKey: ["jobListings"],
    queryFn: getJobListings,
  });

  if (isJobListingsLoading) {
    console.log("Loading job listings");
    return <span>Loading</span>;
  }

  if (jobListingsError) {
    console.log("Error has occurred fetching job listings");
    return <span>Error fetching job listings</span>;
  }

  return (
    <>
      {jobListings.data.map((jobListing) => {
        //Convert joblistng unix timestamps to month/day/year
        const timestamp = jobListing.job_posted_at_timestamp;
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        const month = date.getMonth() + 1; // Months are 0-indexed
        const day = date.getDate();
        const year = date.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        //Only display at max 3 job keywords on job listing card to mitigate overflow
        // const limitedJobKeywords = jobListing.job_keywords.slice(0, 3);

        return (
          <article
            key={jobListing.job_id}
            className={styles.jobListingCardWrapper}
          >
            <img src={jobListing.employer_logo}></img>
            <div className={styles.jobDetailsWrapper}>
              <h3 className={styles.jobListingTitle}>{jobListing.job_title}</h3>
              <p className={styles.jobListingEmployerName}>
                {jobListing.employer_name}
              </p>
              <p className={styles.jobListingLocation}>{`${
                jobListing.job_city
              }${jobListing.job_state ? `, ${jobListing.job_state}` : ""} ${
                jobListing.job_county ? `, ${jobListing.job_county}` : ""
              }`}</p>
              {/* Job description highlights */}
              {/* <ul className={styles.jobListingKeywords}>
                {limitedJobKeywords.map((keyword, index) => {
                  return <li key={index}>{keyword}</li>;
                })}
              </ul> */}
              <ul className={styles.jobListingPreviewText}>
                {jobListing.job_highlights.Responsibilities.map(
                  (listItem, index) => (
                    <li key={index}>{listItem}</li>
                  )
                )}
              </ul>
              <p className={styles.jobListingPostedDate}>
                Posted: {formattedDate}
              </p>
            </div>
          </article>
        );
      })}
    </>
  );
}
