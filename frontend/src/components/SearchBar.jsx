import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={styles.container}>
      <input
        type="search"
        placeholder="Search for a Job..."
        name="jobSearch"
      ></input>
      <input type="submit" value="Search"></input>
      {/* <button onClick={handleJobListings}>Job Listings</button>
      <button onClick={handleJobDetail}>Job Detail</button> */}
    </div>
  );
}
