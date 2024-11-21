import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (userId) {
  const response = await axios.get(
    `https://${BACKEND_URL}/api/user/${userId}/getSavedJobIds`
  );

  return response.data;
}
