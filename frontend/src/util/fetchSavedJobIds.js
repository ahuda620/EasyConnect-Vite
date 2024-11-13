import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;

export default async function (userId) {
  const response = await axios.get(
    `http://${VM_IP}/api/user/${userId}/getSavedJobIds`
  );

  return response.data;
}
