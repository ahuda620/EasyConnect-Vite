import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;
const RAPID_API_KEY = import.meta.env.RAPID_API_KEY;

export default async function (jobIds) {
  if (!jobIds || jobIds.length === 0) {
    console.log("No job ids to fetch. Returning early");
    return [];
  }

  const response = await axios.get(`http://${VM_IP}/api/jobs/fetchJobDetails`, {
    params: {
      jobIds,
      extended_publisher_details: "true",
      markup_job_description: "true",
    },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  });

  return response.data; //change to response.data when using actual api
}
