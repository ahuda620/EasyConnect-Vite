import jobListings from '../data/jobListings.json' with { type: 'json' };
// import jobDetail from '../data/jobDetail.json' with { type: 'json' };
import axios from "axios";

export const getJobListings = async (req, res) => {
  /*MOCK DATA*/
  if(process.env.NODE_ENV === "development"){
    return res.status(200).send(jobListings);
  }

  const searchQuery = req.query.searchQuery;

  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: searchQuery,
    headers: {
      "x-rapidapi-key": `${process.env.RAPID_API_KEY}`,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log("Job fetch response in backend:", response.data.data);
    return res.status(200).send(response.data.data);
  } catch (error) {
    console.error("Error fetching job listings:", error);
    return res.status(500).send("Error fetching external job data");
  }
};

export const getJobDetails = async (req, res) => {
  /*MOCK DATA*/
  if(process.env.NODE_ENV === "development"){
    const jobId = req.query.jobId;
    if (!jobId) {
      console.log("Missing jobIds parameter");
      return res.status(400).send("jobIds parameter is required");
    }
    const matchingJobs = jobListings.data.filter((job) =>
      jobId.includes(job.job_id)
    );
    if (matchingJobs) {
      return res.status(200).send(matchingJobs);
    } else {
      return res.status(400).send("No matching jobs found");
    }
  }

  const jobId = req.query.jobId;

  if (!jobId) {
    console.log("Missing jobIds parameter");
    return res.status(400).send("jobIds parameter is required");
  }

  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/job-details",
    params: {
      job_id: jobId,
      extended_publisher_details: "true",
      markup_job_description: "true",
    },
    headers: {
      "x-rapidapi-key": `${process.env.RAPID_API_KEY}`,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log("Job details fetch response in backend:", response.data.data);
    return res.status(200).send(response.data.data);
  } catch (error) {
    console.error("Error fetching job details:", error);
    return;
  }
};
