import jobListings from '../data/jobListings.json' with { type: 'json' };
import jobDetail from '../data/jobDetail.json' with { type: 'json' };

export const getJobListings = async (req, res) => {
    res.status(200).send(jobListings);
}

export const getJobDetails = async(req,res) => {
    const jobIds = req.query.jobIds;

    if (!jobIds) {
        console.log("Missing jobIds parameter");
        return res.status(400).send("jobIds parameter is required");
    }

    const matchingJobs = jobListings.data.filter(job => jobIds.includes(job.job_id));

    if(matchingJobs){
        return res.status(200).send(matchingJobs);
    }
    else{
        return res.status(400).send("No matching jobs found");
    }
}