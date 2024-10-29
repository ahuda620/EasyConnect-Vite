import styles from "./JobListingCard.module.css";
import dateFormatter from "../util/dateFormatter";
import jobSkillsMatcher from "../util/jobSkillsMatcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function JobListingCard({
  userSkills,
  searchParamObject,
  jobListings,
  handleJobSelect,
}) {
  //Change style of select job listing card container on click
  function handleJobCardClick(event) {
    const element = event.currentTarget; // The clicked job card

    // Remove the 'clicked' class from all job cards
    document.querySelectorAll(`.${styles.jobListingCard}`).forEach((card) => {
      card.classList.remove(styles.clicked);
    });

    // Add the 'clicked' class to the clicked job card
    element.classList.add(styles.clicked);
  }

  return (
    <div className={styles.jobListingsWrapper}>
      <div className={styles.jobSearchQueryHeader}>
        <h4>
          {/* Conditionally render text in jobSearchQueryHeader element depending on 
          if jobSearchTerm and locationSearchTerm are provided by the user */}
          {searchParamObject.jobSearchTerm &&
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
        {jobListings.map((jobListing) => {
          //format the job posted date
          jobListing.posted_date_formatted = dateFormatter(jobListing);

          //display if theres any user skills matching with the job description
          let matchedSkills;

          if (userSkills) {
            matchedSkills = jobSkillsMatcher(
              userSkills,
              jobListing.job_description
            );
          }

          return (
            <article
              key={jobListing.job_id}
              onClick={(event) => {
                handleJobSelect(jobListing);
                handleJobCardClick(event);
              }}
              className={styles.jobListingCard}
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
                  {matchedSkills.slice(0, 4).map((skill) => (
                    <li key={skill} className={styles.matchedSkills}>
                      {/* Captilize first letter of each word of matched skill */}
                      {skill
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={styles.faCheck}
                      />
                    </li>
                  ))}
                  {matchedSkills.length > 4 && (
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
      </div>
    </div>
  );
}
