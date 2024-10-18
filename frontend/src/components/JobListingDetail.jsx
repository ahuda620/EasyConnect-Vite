import styles from "./JobListingDetail.module.css";
import parse from "html-react-parser";

export default function JobListingDetail({ selectedJob }) {
  const jobListing = selectedJob;

  return jobListing ? (
    <article key={jobListing.job_id} className={styles.jobListingDetailWrapper}>
      <img src={jobListing.employer_logo}></img>
      <div className={styles.jobDetailsWrapper}>
        <h3 className={styles.jobListingTitle}>{jobListing.job_title}</h3>
        <p className={styles.jobListingEmployerName}>
          {jobListing.employer_name}
        </p>
        <p className={styles.jobListingLocation}>{`${jobListing.job_city}${
          jobListing.job_state ? `, ${jobListing.job_state}` : ""
        }${jobListing.job_country ? `, ${jobListing.job_country}` : ""}`}</p>

        <hr className={styles.customLineBreak} />
        {jobListing.job_highlights &&
        jobListing.job_highlights.Benefits &&
        jobListing.job_highlights.Benefits.length > 0 ? (
          <>
            <h4 className={styles.jobListingHeaderText}>Benefits</h4>
            <ul className={styles.jobListingBenefits}>
              {jobListing.job_highlights.Benefits.map((benefit, index) => {
                return <li key={index}>{benefit}</li>;
              })}
            </ul>
            <hr className={styles.customLineBreak} />
          </>
        ) : (
          <></>
        )}
        {jobListing.job_highlights &&
        jobListing.job_highlights.Qualifications &&
        jobListing.job_highlights.Qualifications.length > 0 ? (
          <>
            <h4 className={styles.jobListingHeaderText}>Qualifications</h4>
            <ul className={styles.jobListingQualifications}>
              {jobListing.job_highlights.Qualifications.map(
                (qualification, index) => {
                  return <li key={index}>{qualification}</li>;
                }
              )}
            </ul>
            <hr className={styles.customLineBreak} />
          </>
        ) : (
          <></>
        )}
        {jobListing.job_highlights &&
        jobListing.job_highlights.Responsibilities &&
        jobListing.job_highlights.Responsibilities.length > 0 ? (
          <>
            <h4 className={styles.jobListingHeaderText}>Responsibilities</h4>
            <ul className={styles.jobListingResponsibilities}>
              {jobListing.job_highlights.Responsibilities.map(
                (responsibility, index) => {
                  return <li key={index}>{responsibility}</li>;
                }
              )}
            </ul>
            <hr className={styles.customLineBreak} />
          </>
        ) : (
          <></>
        )}
        {jobListing.job_description ? (
          <>
            <h4 className={styles.jobListingHeaderText}>
              Full Job Description
            </h4>
            <p className={styles.jobListingDescription}>
              {parse(jobListing.job_description)}
            </p>
            <hr className={styles.customLineBreak} />
          </>
        ) : (
          <></>
        )}

        <p className={styles.jobListingPostedDate}>
          {jobListing.posted_date_formatted}
        </p>
      </div>
    </article>
  ) : (
    <></>
  );
}
