import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      "By using KarBazar, you agree to follow these terms and all platform policies.",
      "If you do not agree with the terms, please do not use the service.",
    ],
  },
  {
    title: "User Responsibilities",
    bullets: [
      "Provide accurate account information.",
      "Do not engage in fraud, abuse, or harmful behavior.",
      "Respect intellectual property and applicable laws.",
    ],
  },
  {
    title: "Orders and Payments",
    bullets: [
      "Payments must be completed through authorized platform methods.",
      "Order scope, pricing, and timelines should be agreed in-platform.",
      "Disputes are resolved according to KarBazar’s support and review process.",
    ],
  },
  {
    title: "Account Actions",
    paragraphs: [
      "KarBazar may suspend or terminate accounts violating platform policies.",
      "We reserve the right to update terms as the service evolves.",
    ],
  },
];

function TermsOfService() {
  return (
    <InfoPageTemplate
      title="Terms of Service"
      subtitle="Please review these terms carefully before using KarBazar services."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default TermsOfService;