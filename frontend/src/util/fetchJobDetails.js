import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (jobId) {
  if (!jobId) {
    console.log("No job id to fetch. Returning early");
    return [];
  }
  console.log("Fetching job with id: ", jobId);

  try {
    const response = await axios.get(`${BACKEND_URL}/jobs/fetchJobDetails`, {
      params: {
        jobId,
      },
    });
    console.log("Job details fetch response in frontend:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}
