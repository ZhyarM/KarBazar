import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "General Inquiries",
    paragraphs: [
      "For account questions, platform guidance, or partnership opportunities, contact our team at support@karbazar.com.",
      "We typically respond within 24-48 business hours.",
    ],
  },
  {
    title: "Business & Media",
    bullets: [
      "Partnerships: partners@karbazar.com",
      "Press requests: press@karbazar.com",
      "Careers: careers@karbazar.com",
    ],
  },
  {
    title: "Office Hours",
    paragraphs: [
      "Sunday to Thursday, 9:00 AM - 5:00 PM (GMT+3).",
      "Urgent account security reports are reviewed with priority.",
    ],
  },
];

function Contact() {
  return (
    <InfoPageTemplate
      title="Contact"
      subtitle="Need help or want to talk to our team? Here are the best ways to reach us."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default Contact;