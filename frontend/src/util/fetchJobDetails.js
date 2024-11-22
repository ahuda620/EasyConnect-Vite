import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const NODE_ENV = import.meta.env.VITE_NODE_ENV;

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

    if (NODE_ENV === "development") {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}
