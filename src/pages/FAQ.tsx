import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "How do I place an order?",
    paragraphs: [
      "Open any gig, review the package details, and click continue to checkout.",
      "After payment confirmation, your order starts and the seller can begin delivery.",
    ],
  },
  {
    title: "How do payments work?",
    paragraphs: [
      "Payments are processed securely and recorded in your order history.",
      "Funds are released based on order status and completion flow.",
    ],
  },
  {
    title: "Can I request revisions?",
    paragraphs: [
      "Yes. Revisions depend on the package terms selected at checkout.",
      "Use the order conversation to provide clear revision feedback.",
    ],
  },
  {
    title: "How do I become a seller?",
    bullets: [
      "Create and complete your profile.",
      "Publish a gig with clear pricing and deliverables.",
      "Respond quickly to messages and maintain delivery quality.",
    ],
  },
];

function FAQ() {
  return (
    <InfoPageTemplate
      title="Frequently Asked Questions"
      subtitle="Quick answers to common questions about buying, selling, and managing orders on KarBazar."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default FAQ;