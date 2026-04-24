import type { InfoSection } from "./InfoPageTemplate";
import InfoPageTemplate from "./InfoPageTemplate";

const sections: InfoSection[] = [
  {
    title: "Media Resources",
    paragraphs: [
      "KarBazar provides official media assets, product screenshots, and company background for journalists and partners.",
      "For requests, contact press@karbazar.com.",
    ],
  },
  {
    title: "Latest Updates",
    bullets: [
      "New category expansion and seller tooling updates.",
      "Improved order tracking and communication workflows.",
      "Security and trust enhancements for account protection.",
    ],
  },
  {
    title: "Press Contact",
    paragraphs: [
      "For interviews, statements, and announcements, email press@karbazar.com.",
      "Please include your publication, deadline, and topic.",
    ],
  },
];

function PressNews() {
  return (
    <InfoPageTemplate
      title="Press & News"
      subtitle="Official updates, announcements, and media information from KarBazar."
      lastUpdated="April 21, 2026"
      sections={sections}
    />
  );
}

export default PressNews;