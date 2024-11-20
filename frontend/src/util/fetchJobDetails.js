import axios from "axios";

const vmIp = import.meta.env.VITE_VM_IP;
const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;

export default async function (jobId) {
  if (!jobId) {
    console.log("No job id to fetch. Returning early");
    return [];
  }
  console.log("Fetching job with id: ", jobId);

  /* MOCK DATA API REQUEST */
  const response = await axios.get(`http://${vmIp}/api/jobs/fetchJobDetails`, {
    params: {
      jobIds: jobId,
      extended_publisher_details: "true",
      markup_job_description: "true",
    },
  });

  return response.data;

  /* ACTUAL API REQUEST */
  // const options = {
  //   method: "GET",
  //   url: "https://jsearch.p.rapidapi.com/job-details",
  //   params: {
  //     job_id: jobId,
  //     extended_publisher_details: "true",
  //     markup_job_description: "true",
  //   },
  //   headers: {
  //     "x-rapidapi-key": `${rapidApiKey}`,
  //     "x-rapidapi-host": "jsearch.p.rapidapi.com",
  //   },
  // };

  // try {
  //   const response = await axios.request(options);

  //   return response.data.data;
  // } catch (error) {
  //   console.error("Error fetching job details:", error);
  // }
}
