import jobListings from '../data/jobListings.json' with { type: 'json' };

export const getJobListings = async (req, res) => {
    if(req.auth){
        console.log(req.auth);
    }
    res.json(jobListings);
}
