type Plan = {
  id: string;
  name: string;
  price: string;
  duration: string;
  badge?: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

export const plans: Plan[] = [
  {
    id: "monthly",
    name: "Starter",
    price: "$49",
    duration: "for small projects",
    features: [
      "Clear, fixed pricing",
      "Fast project kickoff",
      "Standard support",
    ],
    cta: "Get Started",
  },
  {
    id: "six-month",
    name: "Growth",
    price: "$149",
    duration: "for scaling businesses",
    badge: "Most Popular",
    features: [
      "Flexible project scopes",
      "Priority support",
      "Lower service fees",
    ],
    cta: "Choose Growth",
    highlight: true,
  },
  {
    id: "yearly",
    name: "Enterprise",
    price: "Custom",
    duration: "for large teams",
    features: [
      "Custom pricing strategy",
      "Dedicated account support",
      "Multi-project management",
    ],
    cta: "Talk to Us",
  },
];
