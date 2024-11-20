import axios from "axios";

const vmIp = import.meta.env.VITE_VM_IP;
const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;

export default async function (searchParamObject) {
  // console.log(searchParamObject);
  const { initialSearch, jobSearchTerm, locationSearchTerm, ...params } =
    searchParamObject;

  /* MOCK DATA API REQUEST */
  // try {
  //   const response = await axios.get(`http://${vmIp}/api/jobs/`);
  //   console.log(response);
  //   return response.data.data;
  // } catch (error) {
  //   console.error(error);
  // }

  /* ACTUAL API REQUEST */
  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params,
    headers: {
      "x-rapidapi-key": `${rapidApiKey}`,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching job listings:", error);
  }
}
