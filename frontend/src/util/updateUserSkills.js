import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (userId, skills) {
  const response = await axios.patch(
    `${BACKEND_URL}/user/${userId}/updateSkills`,
    { skills }
  );
  return response.data;
}
