import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (jobId) {
  if (!jobId) {
    console.log("No job id to fetch. Returning early");
    return [];
  }

  try {
    const response = await axios.get(`${BACKEND_URL}/jobs/fetchJobDetails`, {
      params: {
        jobId,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}
