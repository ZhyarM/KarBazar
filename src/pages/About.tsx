import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "Who We Are",
    paragraphs: [
      "KarBazar is a marketplace that connects clients with trusted freelancers and agencies across design, development, marketing, writing, and more.",
      "Our mission is to make online hiring simpler, safer, and more accessible for everyone in our region and beyond.",
    ],
  },
  {
    title: "What We Offer",
    bullets: [
      "A curated catalog of service listings with transparent pricing.",
      "Secure order flow from project request to final delivery.",
      "Messaging, reviews, and profile systems to build trust.",
      "Tools for sellers to grow visibility and manage work efficiently.",
    ],
  },
  {
    title: "Our Values",
    bullets: [
      "Trust first: we prioritize account security and clear communication.",
      "Quality outcomes: we promote reliable service standards.",
      "Fair opportunity: we support both new and established sellers.",
      "Continuous improvement: we evolve based on user feedback.",
    ],
  },
];

function About() {
  return (
    <InfoPageTemplate
      title="About KarBazar"
      subtitle="Learn more about our platform, mission, and the principles guiding everything we build."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default About;