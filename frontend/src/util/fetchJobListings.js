import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;

export default async function (searchParamObject) {
  console.log(searchParamObject); //TODO: delete jobSearchTerm and locationSearchTerm properties before sending to api
  const response = await axios.get(`http://${VM_IP}/api/jobs/`);

  // if (Number(searchParamObject.page) > 1) {
  //   return [];
  // } else {
  //   return response.data.data;
  // }
  return response.data.data;
}
