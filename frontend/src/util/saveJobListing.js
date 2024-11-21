import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (userId, jobId) {
  const response = await axios.post(
    `https://${BACKEND_URL}/api/user/${userId}/saveJobListing`,
    { jobId }
  );
  return response.data;
}
