import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import codingIMG from "./../assets/codingIMG.jpg";
import type { PrcingPlanTypes } from "./PricingPlans";
import { pricingPlans } from "./PricingPlans";

export type User = {
  user_id: string;
  username: string;
  description: string;
  rating: string;
  rating_number: string;
  star_icon?: ReactNode;
  charge: string;
  user_background_img?: string;
  user_profile_img?: string;
  seller_level?: string;
  category: string;
  subcategory: string;
  tabs?: Array<"Description" | "Reviews" | "FAQ">;
  pricing: PrcingPlanTypes[];
  about?: {
    title?: string;
    intro?: string;
    whatYoullGet?: string[];
    technologies?: string[];
  };
};

const star = <FontAwesomeIcon icon={faStar} />;

const users: User[] = [
  {
    user_id: "1",
    username: "sarah_johnson",
    description: "I will design a modern and professional website UI/UX",
    rating: "4.9",
    rating_number: "342",
    star_icon: star,
    charge: "$2000",
    user_background_img: codingIMG,
    seller_level: "Top Rated Seller",
    category: "Graphics & Design",
    subcategory: "UI/UX",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Professional UI/UX designer with 5+ years of experience.",
      whatYoullGet: [
        "Modern UI design",
        "Responsive layouts",
        "Design system",
        "Fast delivery",
        "Unlimited revisions",
        "Post-delivery support"
      ],
      technologies: ["Figma", "Adobe XD", "Photoshop", "InVision"]
    }
  },
  {
    user_id: "2",
    username: "alex_frontend",
    description: "I will build a fast and responsive React website",
    rating: "4.8",
    rating_number: "198",
    star_icon: star,
    charge: "$1500",
    user_background_img: codingIMG,
    seller_level: "Level 2 Seller",
    category: "Programming & Tech",
    subcategory: "Frontend Development",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Frontend developer specializing in React.",
      whatYoullGet: [
        "Pixel-perfect UI",
        "Reusable components",
        "Performance optimization",
        "Clean code",
        "Responsive design",
        "Support after delivery"
      ],
      technologies: ["React", "TypeScript", "Tailwind", "Vite"]
    }
  },
  {
    user_id: "3",
    username: "node_master",
    description: "I will develop a secure backend API",
    rating: "4.7",
    rating_number: "164",
    star_icon: star,
    charge: "$1800",
    user_background_img: codingIMG,
    seller_level: "Level 2 Seller",
    category: "Programming & Tech",
    subcategory: "Backend Development",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Backend engineer focused on scalability.",
      whatYoullGet: [
        "REST API",
        "Authentication",
        "Database design",
        "Error handling",
        "Documentation",
        "Maintenance support"
      ],
      technologies: ["Node.js", "Express", "MongoDB", "JWT"]
    }
  },
  {
    user_id: "4",
    username: "fullstack_ryan",
    description: "I will create a full-stack web application",
    rating: "4.9",
    rating_number: "221",
    star_icon: star,
    charge: "$2500",
    user_background_img: codingIMG,
    seller_level: "Top Rated Seller",
    category: "Programming & Tech",
    subcategory: "Full Stack Development",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Full-stack developer delivering production-ready apps.",
      whatYoullGet: [
        "Frontend & backend",
        "Database integration",
        "Secure auth",
        "Deployment ready",
        "Clean architecture",
        "Long-term support"
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "Docker"]
    }
  },
  {
    user_id: "5",
    username: "mobile_ui_lina",
    description: "I will design mobile app UI for iOS and Android",
    rating: "4.6",
    rating_number: "143",
    star_icon: star,
    charge: "$1300",
    user_background_img: codingIMG,
    seller_level: "Level 1 Seller",
    category: "Graphics & Design",
    subcategory: "Mobile App Design",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Mobile UI designer focused on usability.",
      whatYoullGet: [
        "iOS & Android UI",
        "UX flows",
        "Design handoff",
        "Prototypes",
        "Modern layouts",
        "Revisions"
      ],
      technologies: ["Figma", "Material Design", "Auto Layout"]
    }
  },
  {
    user_id: "6",
    username: "flutter_dev",
    description: "I will build a Flutter mobile application",
    rating: "4.8",
    rating_number: "176",
    star_icon: star,
    charge: "$1900",
    user_background_img: codingIMG,
    seller_level: "Level 2 Seller",
    category: "Programming & Tech",
    subcategory: "Flutter Development",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Flutter developer for cross-platform apps.",
      whatYoullGet: [
        "Cross-platform app",
        "State management",
        "API integration",
        "Testing",
        "Clean architecture",
        "Support"
      ],
      technologies: ["Flutter", "Dart", "Firebase"]
    }
  },
  {
    user_id: "7",
    username: "data_oliver",
    description: "I will analyze your data and build dashboards",
    rating: "4.7",
    rating_number: "201",
    star_icon: star,
    charge: "$1600",
    user_background_img: codingIMG,
    seller_level: "Level 2 Seller",
    category: "Data",
    subcategory: "Data Analysis",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Data analyst helping businesses make decisions.",
      whatYoullGet: [
        "Data cleaning",
        "Dashboards",
        "Reports",
        "Charts",
        "SQL queries",
        "Documentation"
      ],
      technologies: ["Python", "Pandas", "SQL"]
    }
  },
  {
    user_id: "8",
    username: "seo_expert",
    description: "I will optimize your website for SEO",
    rating: "4.6",
    rating_number: "188",
    star_icon: star,
    charge: "$1100",
    user_background_img: codingIMG,
    seller_level: "Level 1 Seller",
    category: "Digital Marketing",
    subcategory: "SEO",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "SEO specialist improving organic traffic.",
      whatYoullGet: [
        "SEO audit",
        "Keyword research",
        "On-page optimization",
        "Performance fixes",
        "SEO report",
        "Support"
      ],
      technologies: ["Google Analytics", "Ahrefs"]
    }
  },
  {
    user_id: "9",
    username: "backend_james",
    description: "I will build scalable backend services",
    rating: "4.8",
    rating_number: "267",
    star_icon: star,
    charge: "$2200",
    user_background_img: codingIMG,
    seller_level: "Top Rated Seller",
    category: "Programming & Tech",
    subcategory: "Backend Systems",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Senior backend engineer.",
      whatYoullGet: [
        "Scalable APIs",
        "Cloud-ready backend",
        "Security setup",
        "Monitoring",
        "Docs",
        "Maintenance"
      ],
      technologies: ["Node.js", "AWS", "PostgreSQL"]
    }
  },
  {
    user_id: "10",
    username: "ui_mariam",
    description: "I will redesign your website UI",
    rating: "4.5",
    rating_number: "119",
    star_icon: star,
    charge: "$1000",
    user_background_img: codingIMG,
    seller_level: "Level 1 Seller",
    category: "Graphics & Design",
    subcategory: "Website Redesign",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "UI designer improving visual clarity.",
      whatYoullGet: [
        "Website redesign",
        "UX improvements",
        "Responsive layout",
        "Design files",
        "Revisions",
        "Support"
      ],
      technologies: ["Figma", "UX Research"]
    }
  },
  {
    user_id: "11",
    username: "qa_sam",
    description: "I will test your web application for bugs",
    rating: "4.7",
    rating_number: "154",
    star_icon: star,
    charge: "$900",
    user_background_img: codingIMG,
    seller_level: "Level 1 Seller",
    category: "Programming & Tech",
    subcategory: "Quality Assurance",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "QA engineer ensuring quality.",
      whatYoullGet: [
        "Manual testing",
        "Bug reports",
        "Test cases",
        "Regression testing",
        "Screenshots",
        "Support"
      ],
      technologies: ["Jira", "Postman"]
    }
  },
  {
    user_id: "12",
    username: "wordpress_ella",
    description: "I will build a custom WordPress website",
    rating: "4.8",
    rating_number: "231",
    star_icon: star,
    charge: "$1400",
    user_background_img: codingIMG,
    seller_level: "Level 2 Seller",
    category: "Programming & Tech",
    subcategory: "WordPress Development",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "WordPress developer with custom themes.",
      whatYoullGet: [
        "Custom theme",
        "SEO ready",
        "Fast loading",
        "Responsive design",
        "Admin panel",
        "Support"
      ],
      technologies: ["WordPress", "PHP", "MySQL"]
    }
  },
  {
    user_id: "13",
    username: "dev_ops_max",
    description: "I will set up CI/CD pipelines",
    rating: "4.9",
    rating_number: "189",
    star_icon: star,
    charge: "$2100",
    user_background_img: codingIMG,
    seller_level: "Top Rated Seller",
    category: "Programming & Tech",
    subcategory: "DevOps",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "DevOps engineer automating deployments.",
      whatYoullGet: [
        "CI/CD setup",
        "Dockerization",
        "Cloud integration",
        "Monitoring",
        "Security",
        "Docs"
      ],
      technologies: ["Docker", "GitHub Actions", "AWS"]
    }
  },
  {
    user_id: "14",
    username: "api_nora",
    description: "I will integrate third-party APIs",
    rating: "4.6",
    rating_number: "132",
    star_icon: star,
    charge: "$1200",
    user_background_img: codingIMG,
    seller_level: "Level 1 Seller",
    category: "Programming & Tech",
    subcategory: "API Integration",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "API integration specialist.",
      whatYoullGet: [
        "API integration",
        "Data mapping",
        "Error handling",
        "Testing",
        "Docs",
        "Support"
      ],
      technologies: ["REST", "GraphQL", "Postman"]
    }
  },
  {
    user_id: "15",
    username: "design_omar",
    description: "I will create a complete brand identity",
    rating: "4.8",
    rating_number: "205",
    star_icon: star,
    charge: "$1700",
    user_background_img: codingIMG,
    seller_level: "Level 2 Seller",
    category: "Graphics & Design",
    subcategory: "Brand Identity",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Brand designer helping businesses stand out.",
      whatYoullGet: [
        "Logo design",
        "Brand colors",
        "Typography",
        "Guidelines",
        "Mockups",
        "Revisions"
      ],
      technologies: ["Illustrator", "Photoshop"]
    }
  },
  {
    user_id: "16",
    username: "react_hooks",
    description: "I will refactor your React codebase",
    rating: "4.7",
    rating_number: "168",
    star_icon: star,
    charge: "$1600",
    user_background_img: codingIMG,
    seller_level: "Level 2 Seller",
    category: "Programming & Tech",
    subcategory: "React Optimization",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "React specialist improving code quality.",
      whatYoullGet: [
        "Code refactor",
        "Performance boost",
        "Custom hooks",
        "Bug fixes",
        "Clean structure",
        "Support"
      ],
      technologies: ["React", "TypeScript"]
    }
  },
  {
    user_id: "17",
    username: "security_ali",
    description: "I will secure your web application",
    rating: "4.9",
    rating_number: "247",
    star_icon: star,
    charge: "$2300",
    user_background_img: codingIMG,
    seller_level: "Top Rated Seller",
    category: "Programming & Tech",
    subcategory: "Web Security",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Security engineer protecting applications.",
      whatYoullGet: [
        "Security audit",
        "Vulnerability fixes",
        "Hardening",
        "Reports",
        "Best practices",
        "Support"
      ],
      technologies: ["OWASP", "JWT", "HTTPS"]
    }
  },
  {
    user_id: "18",
    username: "cms_builder",
    description: "I will build a custom CMS",
    rating: "4.6",
    rating_number: "141",
    star_icon: star,
    charge: "$1900",
    user_background_img: codingIMG,
    seller_level: "Level 1 Seller",
    category: "Programming & Tech",
    subcategory: "CMS Development",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "CMS developer building flexible systems.",
      whatYoullGet: [
        "Custom CMS",
        "Roles",
        "Admin dashboard",
        "Secure backend",
        "Docs",
        "Support"
      ],
      technologies: ["Node.js", "React", "MongoDB"]
    }
  },
  {
    user_id: "19",
    username: "performance_guru",
    description: "I will optimize your website performance",
    rating: "4.8",
    rating_number: "192",
    star_icon: star,
    charge: "$1500",
    user_background_img: codingIMG,
    seller_level: "Level 2 Seller",
    category: "Programming & Tech",
    subcategory: "Performance Optimization",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "Performance engineer improving load times.",
      whatYoullGet: [
        "Speed audit",
        "Optimization",
        "Core Web Vitals",
        "Reports",
        "Fixes",
        "Support"
      ],
      technologies: ["Lighthouse", "Web Vitals"]
    }
  },
  {
    user_id: "20",
    username: "ui_animation",
    description: "I will add smooth UI animations",
    rating: "4.7",
    rating_number: "158",
    star_icon: star,
    charge: "$1200",
    user_background_img: codingIMG,
    seller_level: "Level 1 Seller",
    category: "Graphics & Design",
    subcategory: "UI Animation",
    tabs: ["Description", "Reviews", "FAQ"],
    pricing: pricingPlans,
    about: {
      title: "About This Gig",
      intro: "UI animator creating delightful interactions.",
      whatYoullGet: [
        "Smooth animations",
        "Micro-interactions",
        "UX polish",
        "Reusable animations",
        "Performance friendly",
        "Support"
      ],
      technologies: ["Framer Motion", "CSS Animations"]
    }
  }
];

export default users;
