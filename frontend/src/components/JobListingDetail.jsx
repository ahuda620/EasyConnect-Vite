import sanitizeJobDescription from "../util/sanitizeJobDescription";
import styles from "./JobListingDetail.module.css";
import { useUser } from "@clerk/clerk-react";
import jobSkillsMatcher from "../util/jobSkillsMatcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBookmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function JobListingDetail({ userSkills, selectedJob }) {
  const { isSignedIn } = useUser(); //Use Clerk hook to determine if a user is signed on

  const jobListing = selectedJob;

  //display if theres any user skills matching with the job description
  let matchedSkills;

  if (isSignedIn && userSkills && jobListing) {
    matchedSkills = jobSkillsMatcher(userSkills, jobListing.job_description);
  }

  return jobListing ? (
    <article key={jobListing.job_id} className={styles.wrapper}>
      <div className={styles.jobDetailsHeader}>
        <div className={styles.companyInfo}>
          <img src={jobListing.employer_logo}></img>
          <span className={styles.jobListingEmployerName}>
            {jobListing.employer_name}
          </span>
        </div>
        <h3 className={styles.jobListingTitle}>{jobListing.job_title}</h3>
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
          {jobListing.job_is_remote ? " (Remote)" : ""}
        </p>
        <p className={styles.jobListingPostedDate}>
          {jobListing.posted_date_formatted}
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
            matchedSkills.map((skill) => (
              <li key={skill} className={styles.matchedSkills}>
                {/* Captilize first letter of each word of matched skill */}
                {skill
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                <FontAwesomeIcon icon={faCheck} className={styles.faCheck} />
              </li>
            ))}
        </ul>

        <div className={styles.jobListingLinks}>
          <a href="#" className={styles.jobListingApplyLink}>
            Apply
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className={styles.faApplyIcon}
            />
          </a>
          {isSignedIn && (
            <FontAwesomeIcon icon={faBookmark} className={styles.faSaveIcon} />
          )}
        </div>
      </div>

      <div className={styles.jobDetailsBody}>
        {jobListing.job_highlights &&
        jobListing.job_highlights.Responsibilities &&
        jobListing.job_highlights.Responsibilities.length > 0 ? (
          <>
            <h4 className={styles.sectionHeaderText}>Responsibilities</h4>
            <ul className={styles.list}>
              {jobListing.job_highlights.Responsibilities.map(
                (responsibility, index) => {
                  return <li key={index}>{responsibility}</li>;
                }
              )}
            </ul>
            <hr className={styles.lineBreak} />
          </>
        ) : (
          <></>
        )}
        {jobListing.job_highlights &&
        jobListing.job_highlights.Qualifications &&
        jobListing.job_highlights.Qualifications.length > 0 ? (
          <>
            <h4 className={styles.sectionHeaderText}>Qualifications</h4>
            <ul className={styles.list}>
              {jobListing.job_highlights.Qualifications.map(
                (qualification, index) => {
                  return <li key={index}>{qualification}</li>;
                }
              )}
            </ul>
            <hr className={styles.lineBreak} />
          </>
        ) : (
          <></>
        )}
        {jobListing.job_highlights &&
        jobListing.job_highlights.Benefits &&
        jobListing.job_highlights.Benefits.length > 0 ? (
          <>
            <h4 className={styles.sectionHeaderText}>Benefits</h4>
            <ul className={styles.list}>
              {jobListing.job_highlights.Benefits.map((benefit, index) => {
                return <li key={index}>{benefit}</li>;
              })}
            </ul>
            <hr className={styles.lineBreak} />
          </>
        ) : (
          <></>
        )}
        {jobListing.job_description ? (
          <>
            <h4 className={styles.sectionHeaderText}>About the job</h4>
            <p className={styles.jobListingDescription}>
              {sanitizeJobDescription(jobListing.job_description)}
            </p>
          </>
        ) : (
          <></>
        )}
      </div>
    </article>
  ) : (
    <></>
  );
}
