import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "Finding the Right Service",
    bullets: [
      "Use search and category filters to compare relevant gigs.",
      "Read package details, delivery times, and reviews before purchasing.",
      "Message sellers when you need custom scope clarification.",
    ],
  },
  {
    title: "Placing and Managing Orders",
    bullets: [
      "Choose the package that matches your budget and timeline.",
      "Provide complete requirements at checkout.",
      "Track updates and communicate through the order conversation.",
    ],
  },
  {
    title: "Quality and Revisions",
    paragraphs: [
      "Review delivered files carefully and request revisions when needed.",
      "After completion, leave fair feedback to help the community.",
    ],
  },
];

function BuyingOnKarBazar() {
  return (
    <InfoPageTemplate
      title="Buying on KarBazar"
      subtitle="A practical guide for clients to buy confidently and get great project outcomes."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default BuyingOnKarBazar;