import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "Getting Started",
    bullets: [
      "Complete your profile with skills, portfolio, and clear bio.",
      "Create gigs with accurate scope, pricing, and delivery times.",
      "Use strong titles and descriptions so buyers can find you quickly.",
    ],
  },
  {
    title: "Seller Best Practices",
    bullets: [
      "Reply quickly to buyer messages and clarify requirements early.",
      "Deliver on time with quality checks before submission.",
      "Handle revisions professionally and keep communication friendly.",
    ],
  },
  {
    title: "Growing Your Business",
    paragraphs: [
      "High ratings, reliable delivery, and clear service packages increase visibility.",
      "Use analytics and customer feedback to improve your offers over time.",
    ],
  },
];

function SellingOnKarBazar() {
  return (
    <InfoPageTemplate
      title="Selling on KarBazar"
      subtitle="Everything you need to publish services, win clients, and grow as a seller."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default SellingOnKarBazar;