import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (userId, jobId) {
  const response = await axios.post(
    `${BACKEND_URL}/user/${userId}/saveJobListing`,
    { jobId }
  );
  return response.data;
}
