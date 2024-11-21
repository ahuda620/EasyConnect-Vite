import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (userId, jobId) {
  const response = await axios.patch(
    `${BACKEND_URL}/user/${userId}/deleteSavedJobId`,
    {
      jobId,
    }
  );

  return response.data;
}
