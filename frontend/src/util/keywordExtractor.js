import nlp from "compromise";

export default function keywordExtractor(qualifications) {
  return qualifications
    .map((qualification) => {
      //Extract keywords from each sentence/element of the qualifications array
      const doc = nlp(qualification);

      const keywords = doc.topics().out("array");
      return keywords
        .map((keyword) => keyword.replace(/,/g, "").trim()) // Remove commas and trim whitespace
        .filter((keyword) => keyword.trim().length > 0); //Remove any empty arrays
    })
    .flat(); //Combine all arrays into one array
}
