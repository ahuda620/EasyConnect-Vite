import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (userId) {
  const response = await axios.get(`${BACKEND_URL}/user/${userId}/getSkills`);

  return response.data;
}
