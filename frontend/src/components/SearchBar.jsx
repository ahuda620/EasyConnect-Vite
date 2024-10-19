import styles from "./SearchBar.module.css";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({
  handleSearchParamObject,
  handleFetchJobs,
}) {
  const [searchParamObject, setSearchParamObject] = useState({
    query: "",
    page: "1",
    num_pages: "1",
    date_posted: "all",
    markup_job_description: "true",
  });
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [fetchJobs, setFetchJobs] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState({
    datePostedMenu: false,
    remoteMenu: false,
    employmentTypesMenu: false,
    experienceMenu: false,
    distanceMenu: false,
  });

  //update searchQuery
  useEffect(() => {
    const query =
      [jobSearchTerm, locationSearchTerm].filter(Boolean).join(" in ") || ""; //make searchQuery empty if there is no strings to join
    setSearchParamObject((prevState) => ({
      ...prevState,
      query: query,
    }));
  }, [jobSearchTerm, locationSearchTerm]);

  //send updated searchParamObject back to parent component
  useEffect(() => {
    if (searchParamObject.query) {
      //if search query is not empty, send back updated searchParamObject
      handleSearchParamObject(searchParamObject);
      if (fetchJobs) {
        handleFetchJobs(true);
        setFetchJobs(false);
      }
    }
  }, [fetchJobs, handleFetchJobs, handleSearchParamObject, searchParamObject]);

  //effect that tracks if the user click outside the searchParamButtonsWrapper, if so then close all dropdown menus
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    //cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //function that handles the visibility of the search param button drop down menus
  //set visibility of all menus to false initially so that only one menu is visible at a time
  function handleMenuVisibility(menuName) {
    setMenuVisibility((prevState) => ({
      datePostedMenu: false,
      remoteMenu: false,
      employmentTypesMenu: false,
      experienceMenu: false,
      distanceMenu: false,
      [menuName]: !prevState[menuName],
    }));
  }

  //Close all drop down menus if a click happens outside of searchParamButtonsWrapper
  const searchParamButtonsWrapperRef = useRef(null); //getting a reference to searchParamButtonsWrapper
  const handleClickOutside = (e) => {
    if (
      searchParamButtonsWrapperRef.current &&
      !searchParamButtonsWrapperRef.current.contains(e.target)
    ) {
      //if ref exists, and is outside searchParamButtonsWrapper, close all drop down menues

      setMenuVisibility({
        datePostedMenu: false,
        remoteMenu: false,
        employmentTypesMenu: false,
        experienceMenu: false,
        distanceMenu: false,
      });
    }
  };

  //function that handles radio button menu changes to the searchParamObject state
  function handleRadioBtnChange(e) {
    if (e.target.name === "radius" && e.target.value === "Any") {
      //If user selected "Any" option for the radius drop down menu, delete the radius property from searchParamObject, since JSearch API only takes numbers as input
      setSearchParamObject((prevState) => {
        const newState = { ...prevState };
        delete newState[e.target.name];
        return newState;
      });
    } else {
      setSearchParamObject((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }

    setFetchJobs(true); //trigger fetch call in parent component
  }

  //function that handles checkbox menu changes to the searchParamObject state
  function handleCheckBoxChange(e) {
    let checkBoxArray = searchParamObject[e.target.name]?.split(",") || [];

    if (e.target.checked) {
      //if checkbox is checked, push value into array
      checkBoxArray.push(e.target.value);
    } else {
      //if checkbox is uncheck, remove value from array
      checkBoxArray = checkBoxArray.filter((type) => type !== e.target.value);
    }

    //update state of searchParamObject
    if (checkBoxArray.length > 0) {
      //if array length is greater than 0, join new array values with preexisting values in searchParamObject
      setSearchParamObject((prevState) => ({
        ...prevState,
        [e.target.name]: checkBoxArray.join(","),
      }));
    } else {
      //if array is empty, remove property from paramObject
      setSearchParamObject((prevState) => {
        const newState = { ...prevState };
        delete newState[e.target.name];
        return newState;
      });
    }

    setFetchJobs(true); //trigger fetch call in parent component
  }

  return (
    <>
      <div className={styles.searchBarWrapper}>
        <input
          type="search"
          placeholder="Search for a Job..."
          className={styles.jobSearchBar}
          onChange={(e) => {
            setJobSearchTerm(e.target.value);
          }}
        ></input>
        <input
          type="search"
          placeholder="Location..."
          className={styles.locationSearchBar}
          onChange={(e) => {
            setLocationSearchTerm(e.target.value);
          }}
        ></input>
        <button
          className={styles.jobSearchBtn}
          onClick={() => {
            setFetchJobs(true); //trigger fetch call in parent component
          }}
        >
          Search
        </button>
      </div>

      <div
        ref={searchParamButtonsWrapperRef}
        className={styles.searchParamButtonsWrapper}
      >
        <div className={styles.searchParamBtn}>
          <button
            className={
              searchParamObject.date_posted !== "" &&
              searchParamObject.date_posted !== "all"
                ? `${styles.searchParamBtn} ${styles.active}`
                : ""
            }
            onClick={() => handleMenuVisibility("datePostedMenu")}
          >
            Date Posted
            <FontAwesomeIcon icon={faSortDown} />
          </button>
          <div
            className={`${styles.menu} ${
              menuVisibility.datePostedMenu ? styles.visible : ""
            }`}
          >
            <input
              type="radio"
              name="date_posted"
              id="date_posted1"
              value="today"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.date_posted === "today"}
            />
            <label htmlFor="date_posted1">Today</label>
            <input
              type="radio"
              name="date_posted"
              id="date_posted2"
              value="3days"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.date_posted === "3days"}
            />
            <label htmlFor="date_posted2">Last 3 days</label>
            <input
              type="radio"
              name="date_posted"
              id="date_posted3"
              value="week"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.date_posted === "week"}
            />
            <label htmlFor="date_posted3">Last 7 days</label>
            <input
              type="radio"
              name="date_posted"
              id="date_posted4"
              value="month"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.date_posted === "month"}
            />
            <label htmlFor="date_posted4">Last month</label>
            <input
              type="radio"
              name="date_posted"
              id="date_posted5"
              value="all"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.date_posted === "all"}
            />
            <label htmlFor="date_posted5">Any time</label>
          </div>
        </div>
        <div className={styles.searchParamBtn}>
          <button
            className={
              searchParamObject.remote_jobs_only &&
              searchParamObject.remote_jobs_only !== "false"
                ? `${styles.searchParamBtn} ${styles.active}`
                : ""
            }
            onClick={() => handleMenuVisibility("remoteMenu")}
          >
            Remote
            <FontAwesomeIcon icon={faSortDown} />
          </button>
          <div
            className={`${styles.menu} ${
              menuVisibility.remoteMenu ? styles.visible : ""
            }`}
          >
            <input
              type="radio"
              name="remote_jobs_only"
              id="remote_jobs_only1"
              value="true"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.remote_jobs_only === "true"}
            />
            <label htmlFor="remote_jobs_only1">Remote Only</label>
            <input
              type="radio"
              name="remote_jobs_only"
              id="remote_jobs_only2"
              value="false"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.remote_jobs_only === "false"}
            />
            <label htmlFor="remote_jobs_only2">All</label>
          </div>
        </div>
        <div className={styles.searchParamBtn}>
          <button
            className={
              searchParamObject.employment_types &&
              searchParamObject.employment_types.length > 0
                ? `${styles.searchParamBtn} ${styles.active}`
                : ""
            }
            onClick={() => handleMenuVisibility("employmentTypesMenu")}
          >
            Job Type
            <FontAwesomeIcon icon={faSortDown} />
          </button>
          <div
            className={`${styles.menu} ${
              menuVisibility.employmentTypesMenu ? styles.visible : ""
            }`}
          >
            <label>
              <input
                type="checkbox"
                name="employment_types"
                value="FULLTIME"
                onChange={handleCheckBoxChange}
                checked={
                  searchParamObject.employment_types?.includes("FULLTIME") ||
                  false
                }
              />
              Full-time
            </label>
            <label>
              <input
                type="checkbox"
                name="employment_types"
                value="CONTRACTOR"
                onChange={handleCheckBoxChange}
                checked={
                  searchParamObject.employment_types?.includes("CONTRACTOR") ||
                  false
                }
              />
              Contractor
            </label>
            <label>
              <input
                type="checkbox"
                name="employment_types"
                value="PARTTIME"
                onChange={handleCheckBoxChange}
                checked={
                  searchParamObject.employment_types?.includes("PARTTIME") ||
                  false
                }
              />
              Part-time
            </label>
            <label>
              <input
                type="checkbox"
                name="employment_types"
                value="INTERN"
                onChange={handleCheckBoxChange}
                checked={
                  searchParamObject.employment_types?.includes("INTERN") ||
                  false
                }
              />
              Intern
            </label>
          </div>
        </div>
        <div className={styles.searchParamBtn}>
          <button
            className={
              searchParamObject.job_requirements &&
              searchParamObject.job_requirements.length > 0
                ? `${styles.searchParamBtn} ${styles.active}`
                : ""
            }
            onClick={() => handleMenuVisibility("experienceMenu")}
          >
            Experience Level
            <FontAwesomeIcon icon={faSortDown} />
          </button>
          <div
            className={`${styles.menu} ${
              menuVisibility.experienceMenu ? styles.visible : ""
            }`}
          >
            <label>
              <input
                type="checkbox"
                name="job_requirements"
                value="no_experience"
                onChange={handleCheckBoxChange}
                checked={
                  searchParamObject.job_requirements?.includes(
                    "no_experience"
                  ) || false
                }
              />
              No Experience
            </label>
            <label>
              <input
                type="checkbox"
                name="job_requirements"
                value="no_degree"
                onChange={handleCheckBoxChange}
                checked={
                  searchParamObject.job_requirements?.includes("no_degree") ||
                  false
                }
              />
              No Degree
            </label>
            <label>
              <input
                type="checkbox"
                name="job_requirements"
                value="under_3_years_experience"
                onChange={handleCheckBoxChange}
                checked={
                  searchParamObject.job_requirements?.includes(
                    "under_3_years_experience"
                  ) || false
                }
              />
              Under 3 Years
            </label>
            <label>
              <input
                type="checkbox"
                name="job_requirements"
                value="more_than_3_years_experience"
                onChange={handleCheckBoxChange}
                checked={
                  searchParamObject.job_requirements?.includes(
                    "more_than_3_years_experience"
                  ) || false
                }
              />
              More than 3 Years
            </label>
          </div>
        </div>
        {/* UI says distance in miles but convert it to KM for API call */}
        <div className={styles.searchParamBtn}>
          <button
            className={
              searchParamObject.radius
                ? `${styles.searchParamBtn} ${styles.active}`
                : ""
            }
            onClick={() => handleMenuVisibility("distanceMenu")}
          >
            Distance
            <FontAwesomeIcon icon={faSortDown} />
          </button>
          <div
            className={`${styles.menu} ${
              menuVisibility.distanceMenu ? styles.visible : ""
            }`}
          >
            <input
              type="radio"
              name="radius"
              id="radius0"
              value="0"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.radius === "0"}
            />
            <label htmlFor="radius0">Exact Location</label>
            <input
              type="radio"
              name="radius"
              id="radius1"
              value="8.04672"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.radius === "8.04672"}
            />
            <label htmlFor="radius1">Within 5 miles</label>
            <input
              type="radio"
              name="radius"
              id="radius2"
              value="16.0934"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.radius === "16.0934"}
            />
            <label htmlFor="radius2">With 10 miles</label>
            <input
              type="radio"
              name="radius"
              id="radius3"
              value="40.2336"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.radius === "40.2336"}
            />
            <label htmlFor="radius3">With 25 miles</label>
            <input
              type="radio"
              name="radius"
              id="radius4"
              value="80.4672"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.radius === "80.4672"}
            />
            <label htmlFor="radius4">With 50 miles</label>
            <input
              type="radio"
              name="radius"
              id="radius5"
              value="160.934"
              onChange={handleRadioBtnChange}
              checked={searchParamObject.radius === "160.934"}
            />
            <label htmlFor="radius5">With 100 miles</label>
            <input
              type="radio"
              name="radius"
              id="radiusAny"
              value="Any"
              onChange={handleRadioBtnChange}
            />
            <label htmlFor="radiusAny">Any</label>
          </div>
        </div>
      </div>
    </>
  );
}
