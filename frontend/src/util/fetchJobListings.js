import axios from "axios";

export default async function (searchParamObject) {
  console.log(searchParamObject);
  const response = await axios.get("http://localhost:4000/api/jobs/");

  return response.data.data;
}
