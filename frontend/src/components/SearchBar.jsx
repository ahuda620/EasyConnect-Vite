import styles from "./SearchBar.module.css";
import { useState, useEffect, useRef } from "react";

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
    setSearchParamObject((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    setFetchJobs(true); //trigger fetch call in parent component
  }

  //function that handles checkbox menu changes to the searchParamObject state
  function handleCheckboxChange(e) {
    //copy employment_types property values from searchParamObject if it exists
    let employmentTypesArray =
      searchParamObject.employment_types?.split(",") || [];

    if (e.target.checked) {
      //if checkbox is checked, push value into array
      employmentTypesArray.push(e.target.value);
    } else {
      //if checkbox is uncheck, remove value from array
      employmentTypesArray = employmentTypesArray.filter(
        (type) => type !== e.target.value
      );
    }

    //update state of searchParamObject
    if (employmentTypesArray.length > 0) {
      //if array length is greater than 0, join new array values with preexisting searchParamObject employment_types property values
      setSearchParamObject((prevState) => ({
        ...prevState,
        employment_types: employmentTypesArray.join(","),
      }));
    } else {
      //if array is empty, remove employement_type property from paramObject
      setSearchParamObject((prevState) => {
        const newState = { ...prevState };
        delete newState.employment_types;
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
        <div className={styles.datePostedBtn}>
          <button onClick={() => handleMenuVisibility("datePostedMenu")}>
            Date Posted
          </button>
          <div
            className={`${styles.menu} ${
              menuVisibility.datePostedMenu ? styles.visible : ""
            }`}
          >
            <label>
              <input
                type="radio"
                name="date_posted"
                value="today"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.date_posted === "today"}
              />
              Today
            </label>
            <label>
              <input
                type="radio"
                name="date_posted"
                value="3days"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.date_posted === "3days"}
              />
              Last 3 days
            </label>
            <label>
              <input
                type="radio"
                name="date_posted"
                value="week"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.date_posted === "week"}
              />
              Last 7 days
            </label>
            <label>
              <input
                type="radio"
                name="date_posted"
                value="month"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.date_posted === "month"}
              />
              Last month
            </label>
            <label>
              <input
                type="radio"
                name="date_posted"
                value="all"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.date_posted === "all"}
              />
              Any time
            </label>
          </div>
        </div>
        <div className={styles.remoteBtn}>
          <button onClick={() => handleMenuVisibility("remoteMenu")}>
            Remote
          </button>
          <div
            className={`${styles.menu} ${
              menuVisibility.remoteMenu ? styles.visible : ""
            }`}
          >
            <label>
              <input
                type="radio"
                name="remote_jobs_only"
                value="true"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.remote_jobs_only === "true"}
              />
              Remote Only
            </label>
            <label>
              <input
                type="radio"
                name="remote_jobs_only"
                value="false"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.remote_jobs_only === "false"}
              />
              All
            </label>
          </div>
        </div>
        <div className={styles.employmentTypesBtn}>
          <button onClick={() => handleMenuVisibility("employmentTypesMenu")}>
            Job Type
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
                onChange={handleCheckboxChange}
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
                onChange={handleCheckboxChange}
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
                onChange={handleCheckboxChange}
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
                onChange={handleCheckboxChange}
                checked={
                  searchParamObject.employment_types?.includes("INTERN") ||
                  false
                }
              />
              Intern
            </label>
          </div>
        </div>
        <div className={styles.experienceBtn}>
          <button onClick={() => handleMenuVisibility("experienceMenu")}>
            Experience level
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
                onChange={handleCheckboxChange}
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
                onChange={handleCheckboxChange}
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
                onChange={handleCheckboxChange}
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
                onChange={handleCheckboxChange}
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
        <div className={styles.distanceBtn}>
          <button onClick={() => handleMenuVisibility("distanceMenu")}>
            Distance
          </button>
          <div
            className={`${styles.menu} ${
              menuVisibility.distanceMenu ? styles.visible : ""
            }`}
          >
            <label>
              <input
                type="radio"
                name="radius"
                value="8.04672"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.radius === "8.04672"}
              />
              Within 5 miles
            </label>
            <label>
              <input
                type="radio"
                name="radius"
                value="16.0934"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.radius === "16.0934"}
              />
              With 10 miles
            </label>
            <label>
              <input
                type="radio"
                name="radius"
                value="40.2336"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.radius === "40.2336"}
              />
              With 25 miles
            </label>
            <label>
              <input
                type="radio"
                name="radius"
                value="80.4672"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.radius === "80.4672"}
              />
              With 50 miles
            </label>
            <label>
              <input
                type="radio"
                name="radius"
                value="160.934"
                onChange={handleRadioBtnChange}
                checked={searchParamObject.radius === "160.934"}
              />
              With 100 miles
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
