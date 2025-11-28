import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import codingIMG from './../assets/codingIMG.jpg';

export type User = {
  user_id: string;  
  username: string;
  description: string;
  rating: string;
  star_icon: ReactNode;
  rating_number: string;
  charge: string;
  user_background_img?: string;
  user_profile_img?: string;
};


const users: User[] = [
  {
    user_id : "1",
    username: "seller",
    description: "Native iOS developer with Swift and SwiftUI",
    rating: "4.5",
    star_icon: <FontAwesomeIcon icon={faStar} />,
    rating_number: "56",
    charge: "2000$",
    user_background_img: codingIMG,
    user_profile_img: "",
  },

  {
    user_id: "2",
    username: "devmaster99",
    description: "Full-stack web developer • React • Node • MongoDB",
    rating: "4.9",
    star_icon: <FontAwesomeIcon icon={faStar} />,
    rating_number: "130",
    charge: "1500$",
    user_background_img: "",
    user_profile_img: "",
  },

  {
    user_id: "3",
    username: "designqueen",
    description: "UI/UX designer • Figma • Prototyping • Web & Mobile",
    rating: "4.7",
    star_icon: <FontAwesomeIcon icon={faStar} />,
    rating_number: "87",
    charge: "1200$",
    user_background_img: "",
    user_profile_img: "",
  },

  {
    user_id: "4",
    username: "datawizard",
    description: "Data analyst • Python • Pandas • Dashboards",
    rating: "4.8",
    star_icon: <FontAwesomeIcon icon={faStar} />,
    rating_number: "210",
    charge: "1800$",
    user_background_img: "",
    user_profile_img: "",
  }
];

export default users