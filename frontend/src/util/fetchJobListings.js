import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (searchParamObject) {
  const { initialSearch, jobSearchTerm, locationSearchTerm, ...searchQuery } =
    searchParamObject;

  try {
    const response = await axios.get(`${BACKEND_URL}/jobs/`, {
      params: {
        searchQuery,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}
