import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "Our Trust Principles",
    paragraphs: [
      "KarBazar is committed to transparent communication, respectful behavior, and reliable transactions.",
      "We actively monitor abuse reports and enforce platform rules.",
    ],
  },
  {
    title: "Account Security",
    bullets: [
      "Use strong, unique passwords.",
      "Never share login credentials or one-time codes.",
      "Report suspicious messages or payment requests immediately.",
    ],
  },
  {
    title: "Safe Transactions",
    bullets: [
      "Keep communication and payment inside KarBazar.",
      "Review gig details and delivery scope before ordering.",
      "Use the dispute and support channels when needed.",
    ],
  },
];

function TrustSafety() {
  return (
    <InfoPageTemplate
      title="Trust & Safety"
      subtitle="Learn how we protect users and maintain a safe marketplace for buyers and sellers."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default TrustSafety;