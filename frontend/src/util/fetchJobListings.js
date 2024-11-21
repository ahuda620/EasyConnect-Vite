import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (searchParamObject) {
  // console.log(searchParamObject);
  const { initialSearch, jobSearchTerm, locationSearchTerm, ...searchQuery } =
    searchParamObject;

  try {
    const response = await axios.get(`https://${BACKEND_URL}/api/jobs/`, {
      params: {
        searchQuery,
      },
    });
    console.log("Job fetch response in frontend:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}
