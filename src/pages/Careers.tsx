import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "Why Join KarBazar",
    paragraphs: [
      "We are building tools that help people work independently, grow businesses, and access global opportunities.",
      "Our team values ownership, learning, and practical problem solving.",
    ],
  },
  {
    title: "What We Look For",
    bullets: [
      "Strong communication and collaboration.",
      "User-focused mindset and product thinking.",
      "Curiosity, accountability, and consistency.",
      "Experience in product, design, support, or engineering.",
    ],
  },
  {
    title: "How to Apply",
    paragraphs: [
      "Send your CV or portfolio to careers@karbazar.com with the role in the subject line.",
      "If there is no matching role, you can still submit an open application.",
    ],
  },
];

function Careers() {
  return (
    <InfoPageTemplate
      title="Careers"
      subtitle="Help us build a trusted freelancing ecosystem for the next generation of digital work."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default Careers;