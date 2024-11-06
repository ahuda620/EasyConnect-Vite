import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;

export default async function (userId, skills) {
  const response = await axios.patch(
    `http://${VM_IP}/api/user/${userId}/updateSkills`,
    { skills }
  );
  return response.data;
}
