import jobListings from '../data/jobListings.json' with { type: 'json' };

export const getJobListings = async (req, res) => {
    res.json(jobListings);
}
