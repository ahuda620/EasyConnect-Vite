import styles from "./JobListingCard.module.css";
import dateFormatter from "../util/dateFormatter";
// import keywordExtractor from "../util/keywordExtractor";

export default function JobListingCard({ jobListings, handleJobSelect }) {
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
      {jobListings.map((jobListing) => {
        jobListing.posted_date_formatted = dateFormatter(jobListing);

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

              {/* <ul className={styles.jobListingKeywords}>
                {limitedJobKeywords.map((keyword, index) => {
                  return <li key={index}>{keyword}</li>;
                })}
              </ul> */}

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
                  <li>jobListing.job_description</li>
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
