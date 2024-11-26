import Fuse from "fuse.js";

export default function jobSkillsMatcher(userSkills, jobDescription) {
  const jobDescriptionWords = jobDescription.split(" ");

  const fuse = new Fuse(jobDescriptionWords, {
    threshold: 0.1,
    distance: 100,
    findAllMatches: true,
  });

  const matchingSkills = userSkills.filter(
    (skill) =>
      skill.trim() !== "" && fuse.search(skill.toLowerCase()).length > 0
  );

  return matchingSkills;
}
