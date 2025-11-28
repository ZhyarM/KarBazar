import {
  faBriefcase,
  faBullhorn,
  faCamera,
  faChartLine,
  faCode,
  faFilm,
  faKeyboard,
  faLaptopCode,
  faMicrophone,
  faMusic,
  faPalette,
  faPenNib,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

export type CategoryType = {
  logo: ReactNode;
  name: string;
  services: string;
  description: string;
  bg: string;
};

export const categoriesData: CategoryType[] = [
  {
    logo: <FontAwesomeIcon icon={faPalette} />,
    name: "Graphics & Design",
    services: "2.5k+ services",
    description: "Logo design, brand identity, illustrations, and more",
    bg: "bg-gradient-to-br from-pink-500 to-fuchsia-600",
  },
  {
    logo: <FontAwesomeIcon icon={faCode} />,
    name: "Programming & Tech",
    services: "3.2k+ services",
    description: "Web development, mobile apps, and software solutions",
    bg: "bg-gradient-to-br from-blue-500 to-blue-700",
  },
  {
    logo: <FontAwesomeIcon icon={faBullhorn} />,
    name: "Digital Marketing",
    services: "1.8k+ services",
    description: "SEO, social media, email marketing, and advertising",
    bg: "bg-gradient-to-br from-orange-400 to-orange-600",
  },
  {
    logo: <FontAwesomeIcon icon={faFilm} />,
    name: "Video & Animation",
    services: "1.4k+ services",
    description: "Video editing, animation, motion graphics, and more",
    bg: "bg-gradient-to-br from-purple-500 to-indigo-600",
  },
  {
    logo: <FontAwesomeIcon icon={faPenNib} />,
    name: "Writing & Translation",
    services: "2.1k+ services",
    description: "Content writing, translation, proofreading, and more",
    bg: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
  {
    logo: <FontAwesomeIcon icon={faMusic} />,
    name: "Music & Audio",
    services: "900+ services",
    description: "Voiceovers, mixing & mastering, music production",
    bg: "bg-gradient-to-br from-yellow-400 to-amber-500",
  },
  {
    logo: <FontAwesomeIcon icon={faBriefcase} />,
    name: "Business",
    services: "1.7k+ services",
    description: "Consulting, business plans, management support",
    bg: "bg-gradient-to-br from-gray-600 to-gray-800",
  },
  {
    logo: <FontAwesomeIcon icon={faChartLine} />,
    name: "Data & Analytics",
    services: "1.3k+ services",
    description: "Data analysis, dashboards, machine learning insights",
    bg: "bg-gradient-to-br from-cyan-500 to-blue-500",
  },
  {
    logo: <FontAwesomeIcon icon={faKeyboard} />,
    name: "Data Entry",
    services: "1.1k+ services",
    description: "Data entry, typing, Excel sheets, and admin tasks",
    bg: "bg-gradient-to-br from-teal-400 to-teal-600",
  },
  {
    logo: <FontAwesomeIcon icon={faLaptopCode} />,
    name: "Web Design",
    services: "2k+ services",
    description: "UI/UX design, responsive layouts, and website redesigns",
    bg: "bg-gradient-to-br from-rose-500 to-pink-600",
  },
  {
    logo: <FontAwesomeIcon icon={faCamera} />,
    name: "Photography",
    services: "800+ services",
    description: "Product photography, portraits, and photo editing",
    bg: "bg-gradient-to-br from-lime-500 to-green-500",
  },
  {
    logo: <FontAwesomeIcon icon={faMicrophone} />,
    name: "Podcasting",
    services: "500+ services",
    description: "Podcast editing, production, and audio enhancement",
    bg: "bg-gradient-to-br from-red-500 to-red-700",
  },
];
