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
  };

  const cardContent: CardContentItem[] = [
    { logo: <FontAwesomeIcon icon={faSuitcase} />, text: "Business" },
    { logo: <FontAwesomeIcon icon={faArrowTrendUp} />, text: "Data & Analytics"},
    { logo: <FontAwesomeIcon icon={faBullhorn} />, text: "Digital Marketing" },
    { logo: <FontAwesomeIcon icon={faFileLines} />, text: "E-commerce" },
    { logo: <FontAwesomeIcon icon={faPalette} />, text: "Graphics & Design" },
    { logo: <FontAwesomeIcon icon={faCircleCheck} />, text: "Music & Audio" },
    { logo: <FontAwesomeIcon icon={faMusic} />, text: "Lifestyle" },
    { logo: <FontAwesomeIcon icon={faCode} />, text: "Programming & Tech" },
  ];

  export default cardContent;