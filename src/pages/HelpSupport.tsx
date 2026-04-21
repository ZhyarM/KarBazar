import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "How We Support You",
    paragraphs: [
      "Our support team helps with account access, order issues, and platform guidance.",
      "Before contacting support, check FAQ and order details for faster resolution.",
    ],
  },
  {
    title: "Best Way to Get Help",
    bullets: [
      "Use in-platform messages for order-specific requests.",
      "Include order ID, screenshots, and clear issue details.",
      "Contact support@karbazar.com for account-level problems.",
    ],
  },
  {
    title: "Response Expectations",
    paragraphs: [
      "Most tickets are answered within 24-48 business hours.",
      "Urgent security concerns receive priority handling.",
    ],
  },
];

function HelpSupport() {
  return (
    <InfoPageTemplate
      title="Help & Support"
      subtitle="Need assistance? We’re here to help you resolve issues quickly and clearly."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default HelpSupport;