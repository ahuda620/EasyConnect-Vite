import axios from "axios";

const VM_IP = import.meta.env.VITE_VM_IP;

export default async function (searchParamObject) {
  console.log(searchParamObject);
  const response = await axios.get(`http://${VM_IP}/api/jobs/`);
  // const response = await axios.get("http://192.168.1.24:4000/api/jobs/");

  return response.data.data;
}
