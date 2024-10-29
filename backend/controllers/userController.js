import user from '../data/mockUser.json' with { type: 'json' };

export const getUserSkills = async (req, res) => {
    const userId = req.params.userId;
    
    res.json(user.skills);
}