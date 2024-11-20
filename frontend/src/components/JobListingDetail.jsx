import styles from "./JobListingDetail.module.css";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import sanitizeJobDescription from "../util/sanitizeJobDescription";
import jobSkillsMatcher from "../util/jobSkillsMatcher";
import saveJobListing from "../util/saveJobListing";
import { useIsMobile } from "../context/MobileContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBookmark,
  faCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function JobListingDetail({
  className, //classname prop is for toggling visiblity of this component on mobile
  userSkills,
  selectedJob,
  handleBacktoJobListings,
}) {
  const { user } = useUser();
  const location = useLocation();
  const isMobile = useIsMobile();

  const mutation = useMutation({
    mutationFn: (jobId) => saveJobListing(user?.id, jobId),
    onSuccess: (data) => {
      if (data === "Job listing is already saved") {
        toast.info("Job already saved.");
      } else {
        toast.success("Job successfuly saved.");
      }
    },
    onError: (error) => {
      if (
        error.response &&
        error.response.data === "You can only save up to 5 job listings"
      ) {
        toast.error("You can only save up to 5 job listings.");
      } else {
        toast.error("Failed to save job.");
      }
    },
  });

  const handleSaveJob = async (jobId) => {
    try {
      await mutation.mutateAsync(jobId);
    } catch (error) {
      console.error("Error saving job listing:", error);
    }
  };

  const jobListing = selectedJob;

  //display if theres any user skills matching with the job description
  let matchedSkills;

  if (user && userSkills && jobListing) {
    matchedSkills = jobSkillsMatcher(userSkills, jobListing.job_description);
  }

  return (
    jobListing && (
      <article
        key={jobListing.job_id}
        className={`${styles.wrapper} ${className || ""}`}
      >
        {isMobile && (
          <button className={styles.backBtn} onClick={handleBacktoJobListings}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <div className={styles.jobDetailsHeader}>
          <div className={styles.companyInfo}>
            {jobListing.employer_logo && (
              <img src={jobListing.employer_logo}></img>
            )}
            <span className={styles.jobListingEmployerName}>
              {jobListing.employer_name}
            </span>
          </div>
          <h3 className={styles.jobListingTitle}>{jobListing.job_title}</h3>
          {jobListing.job_city ||
            jobListing.job_state ||
            (jobListing.job_country && (
              <p className={styles.jobListingLocation}>
                {[
                  jobListing.job_city,
                  jobListing.job_state,
                  jobListing.job_country,
                ]
                  .filter(Boolean)
                  .join(", ")}
                {jobListing.job_is_remote && " (Remote)"}
              </p>
            ))}
          {jobListing.job_posted_human_readable ? (
            <p className={styles.jobListingPostedDate}>
              {jobListing.job_posted_human_readable}
            </p>
          ) : jobListing.posted_date_formatted ? (
            <p className={styles.jobListingPostedDate}>
              {jobListing.posted_date_formatted}
            </p>
          ) : (
            <p className={styles.jobListingPostedDate}>N/A</p>
          )}
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
            {user && location.pathname !== "/saved-jobs" && (
              <>
                <button
                  className={styles.saveBtn}
                  onClick={() => handleSaveJob(jobListing.job_id)}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className={styles.faSaveIcon}
                  />
                </button>
              </>
            )}
          </div>
        </div>
        <div className={styles.jobDetailsBody}>
          {jobListing.job_highlights &&
            jobListing.job_highlights.Responsibilities &&
            jobListing.job_highlights.Responsibilities.length > 0 && (
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
            )}
          {jobListing.job_highlights &&
            jobListing.job_highlights.Qualifications &&
            jobListing.job_highlights.Qualifications.length > 0 && (
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
            )}
          {jobListing.job_highlights &&
            jobListing.job_highlights.Benefits &&
            jobListing.job_highlights.Benefits.length > 0 && (
              <>
                <h4 className={styles.sectionHeaderText}>Benefits</h4>
                <ul className={styles.list}>
                  {jobListing.job_highlights.Benefits.map((benefit, index) => {
                    return <li key={index}>{benefit}</li>;
                  })}
                </ul>
                <hr className={styles.lineBreak} />
              </>
            )}
          {jobListing.job_description && (
            <>
              <h4 className={styles.sectionHeaderText}>About the job</h4>
              <article className={styles.jobListingDescription}>
                {sanitizeJobDescription(jobListing.job_description)}
              </article>
            </>
          )}
        </div>
      </article>
    )
  );
}
