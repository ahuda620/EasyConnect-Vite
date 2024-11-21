import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (userId, jobId) {
  const response = await axios.patch(
    `https://${BACKEND_URL}/api/user/${userId}/deleteSavedJobId`,
    {
      jobId,
    }
  );

  return response.data;
}
