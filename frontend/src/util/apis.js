import axios from "axios";

export const getJobListings = async () => {
  const response = await axios.get("http://localhost:4000/api/jobs/");
  return response.data;
};
