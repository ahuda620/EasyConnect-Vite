import styles from "./JobListingCard.module.css";
import { useQuery } from "@tanstack/react-query";
import { getJobListings } from "../util/apis";
import dateFormatter from "../util/dateFormatter";
import keywordExtractor from "../util/keywordExtractor";

export default function JobListingCard({ handleJobSelect }) {
  //Fetch Job Listings
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

  //Change style of select job listing card container on click
  function handleJobCardClick(event) {
    const element = event.currentTarget; // The clicked job card

    // Remove the 'clicked' class from all job cards
    document
      .querySelectorAll(`.${styles.jobListingCardWrapper}`)
      .forEach((card) => {
        card.classList.remove(styles.clicked);
      });

    // Add the 'clicked' class to the clicked job card
    element.classList.add(styles.clicked);
  }

  return (
    <>
      {jobListings.data.map((jobListing) => {
        jobListing.posted_date_formatted = dateFormatter(jobListing);
        jobListing.job_keywords = keywordExtractor(
          jobListing.job_highlights.Qualifications
        );

        //Only display at max 3 job keywords on job listing card to mitigate overflow
        const limitedJobKeywords = jobListing.job_keywords.slice(0, 3);

        return (
          <article
            key={jobListing.job_id}
            onClick={(event) => {
              handleJobSelect(jobListing);
              handleJobCardClick(event);
            }}
            className={styles.jobListingCardWrapper}
          >
            {jobListing.employer_logo ? (
              <img
                src={jobListing.employer_logo}
                className={styles.employerLogo}
              ></img>
            ) : (
              <div className={styles.employerLogoPlaceholder}></div>
            )}
            <div className={styles.jobDetailsWrapper}>
              <h3 className={styles.jobListingTitle}>{jobListing.job_title}</h3>
              <p className={styles.jobListingEmployerName}>
                {jobListing.employer_name}
              </p>
              <p className={styles.jobListingLocation}>{`${
                jobListing.job_city
              }${jobListing.job_state ? `, ${jobListing.job_state}` : ""}${
                jobListing.job_country ? `, ${jobListing.job_country}` : ""
              }`}</p>
              {/* Job description highlights */}
              <ul className={styles.jobListingKeywords}>
                {limitedJobKeywords.map((keyword, index) => {
                  return <li key={index}>{keyword}</li>;
                })}
              </ul>
              <ul className={styles.jobListingPreviewText}>
                {jobListing.job_highlights.Responsibilities.map(
                  (listItem, index) => (
                    <li key={index}>{listItem}</li>
                  )
                )}
              </ul>
              <p className={styles.jobListingPostedDate}>
                {jobListing.posted_date_formatted}
              </p>
            </div>
          </article>
        );
      })}
    </>
  );
}
