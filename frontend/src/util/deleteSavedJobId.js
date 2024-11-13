import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;

export default async function (userId, jobId) {
  const response = await axios.patch(
    `http://${VM_IP}/api/user/${userId}/deleteSavedJobId`,
    {
      jobId,
    }
  );

  return response.data;
}
