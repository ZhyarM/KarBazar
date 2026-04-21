import {
  faArrowTrendUp,
  faBullhorn,
  faCircleCheck,
  faCode,
  faFileLines,
  faMusic,
  faPalette,
  faSuitcase,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { JSX } from "react";

type CardContentItem = {
    logo: JSX.Element;
    text: string;
    category: string;
  };

  const cardContent: CardContentItem[] = [
  { logo: <FontAwesomeIcon icon={faSuitcase} />, text: "Business", category: "business" },
  { logo: <FontAwesomeIcon icon={faArrowTrendUp} />, text: "Data & Analytics", category: "data-analytics" },
  { logo: <FontAwesomeIcon icon={faBullhorn} />, text: "Digital Marketing", category: "digital-marketing" },
  { logo: <FontAwesomeIcon icon={faFileLines} />, text: "E-commerce", category: "ecommerce" },
  { logo: <FontAwesomeIcon icon={faPalette} />, text: "Graphics & Design", category: "graphics-design" },
  { logo: <FontAwesomeIcon icon={faCircleCheck} />, text: "Music & Audio", category: "music-audio" },
  { logo: <FontAwesomeIcon icon={faMusic} />, text: "Lifestyle", category: "lifestyle" },
  { logo: <FontAwesomeIcon icon={faCode} />, text: "Programming & Tech", category: "programming-tech" },
];

  export default cardContent;