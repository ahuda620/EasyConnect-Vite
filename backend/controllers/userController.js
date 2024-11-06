import db from "../database/db.js";
import user from '../data/mockUser.json' with { type: 'json' };

export const updateUserSkills = async(req,res) => {
    const {userId} = req.params;
    const { skills } = req.body;

    //Validate skills array
    if(!skills || !Array.isArray(skills) || skills.length === 0 || !userId){
        return res.status(400).send({error:"Invalid skills format"});
    }

    //update user skills in database
    try {
        const [rows] = await db.query("UPDATE users SET skills = ? WHERE id = ?", [JSON.stringify(skills), userId]);
        return res.status(200).send("Skills updated in database successfully");
    } catch (error) {
        console.error("Error updating user skills in database");
        return res.status(500).send(error.message);
    }

}

export const getUserSkills = async(req, res) => {
    const userId = req.params.userId;

    try {
        const [rows] = await db.query("SELECT skills FROM users WHERE id = ?", [userId]);

        const skills = JSON.parse(rows[0].skills);

        res.status(200).send(skills);
    } catch (error) {
        console.error("Error fetching user skills in database");
        return res.status(500).send(error.message);
    }

    
}