import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const NODE_ENV = import.meta.env.VITE_NODE_ENV;

export default async function (searchParamObject) {
  const { initialSearch, jobSearchTerm, locationSearchTerm, ...searchQuery } =
    searchParamObject;

  try {
    const response = await axios.get(`${BACKEND_URL}/jobs/`, {
      params: {
        searchQuery,
      },
    });

    if (NODE_ENV === "development") {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}
