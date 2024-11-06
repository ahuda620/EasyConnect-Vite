import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;

export default async function (searchParamObject) {
  console.log(searchParamObject);
  const response = await axios.get(`http://${VM_IP}/api/jobs/`);

  return response.data.data;
}
