import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;

export default async function (userId, jobId) {
  const response = await axios.post(
    `http://${VM_IP}/api/user/${userId}/saveJobListing`,
    { jobId }
  );
  return response.data;
}
