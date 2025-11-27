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
    name: "Monthly",
    price: "$9.99",
    duration: "per month",
    features: ["20 project posts", "Unlimited browsing", "Standard support"],
    cta: "Choose Monthly",
  },
  {
    id: "six-month",
    name: "6 Months",
    price: "$49.99",
    duration: "every 6 months",
    badge: "Most Popular",
    features: ["150 project posts", "Priority chat support", "10% fee discount"],
    cta: "Choose 6 Months",
    highlight: true,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$89.99",
    duration: "per year",
    features: ["Unlimited posts", "Priority support", "20% fee discount"],
    cta: "Choose Yearly",
  },
];