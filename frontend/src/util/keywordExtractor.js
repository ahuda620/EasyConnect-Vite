import nlp from "compromise";

export default function keywordExtractor(
  qualifications,
  responsibilities,
  jobDescription
) {
  let keywords = qualifications
    .map((qualification) => {
      //Extract keywords from each sentence/element of the qualifications array
      let doc = nlp(qualification);
      let extractedWords = doc.topics().out("array");

      return extractedWords
        .map((extractedWord) => extractedWord.replace(/,/g, "").trim()) // Remove commas and trim whitespace
        .filter((extractedWord) => extractedWord.trim().length > 0); //Remove any empty arrays
    })
    .flat(); //Combine all arrays into one array

  //If no keywords were extracted from qualifications, try responsibilities
  if (keywords.length === 0) {
    keywords = responsibilities
      .map((responsibilities) => {
        //Extract keywords from each sentence/element of the qualifications array
        let doc = nlp(responsibilities);
        let extractedWords = doc.topics().out("array");

        return extractedWords
          .map((extractedWord) => extractedWord.replace(/,/g, "").trim()) // Remove commas and trim whitespace
          .filter((extractedWord) => extractedWord.trim().length > 0); //Remove any empty arrays
      })
      .flat(); //Combine all arrays into one array
  }

  //If no keywords were extracted from responsibilities, fall back to job description
  if (keywords.length === 0) {
    let doc = nlp(jobDescription);
    keywords = doc
      .topics()
      .out("array")
      .map((extractedWord) => extractedWord.replace(/,/g, "").trim()) // Remove commas and trim whitespace
      .filter((extractedWord) => extractedWord.trim().length > 0); //Remove any empty arrays
  }
  return keywords;
}
