import axios from "axios";

const vmIp = import.meta.env.VITE_VM_IP;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default async function (jobId) {
  if (!jobId) {
    console.log("No job id to fetch. Returning early");
    return [];
  }
  console.log("Fetching job with id: ", jobId);

  /* MOCK DATA API REQUEST */
  // const response = await axios.get(`http://${vmIp}/api/jobs/fetchJobDetails`, {
  //   params: {
  //     jobIds: jobId,
  //     extended_publisher_details: "true",
  //     markup_job_description: "true",
  //   },
  // });

  // return response.data;

  try {
    const response = await axios.get(
      `http://${BACKEND_URL}/api/jobs/fetchJobDetails`,
      {
        params: {
          jobId,
        },
      }
    );
    console.log("Job details fetch response in frontend:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}
