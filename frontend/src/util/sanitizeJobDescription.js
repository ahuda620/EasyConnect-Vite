import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function sanitizeJobDescription(jobDescription) {
  const cleanHTML = DOMPurify.sanitize(jobDescription); //sanitize jobDescription use DOMPurify

  //remove inline html styles from jobDescription using html-react-parser
  return parse(cleanHTML, {
    replace: (domNode) => {
      if (domNode.attribs && domNode.attribs.style) {
        delete domNode.attribs.style;
      }
      return domNode;
    },
  });
}
