export type PrcingPlanTypes = {
  name: "Basic" | "Standard" | "Premium";
  price: number;
  packageType: string;
  deliveryDays: number;
  revisions: string;
  features: string[];
};

export const pricingPlans: PrcingPlanTypes[] = [
  {
    name: "Basic",
    price: 300,
    packageType: "Basic Package",
    deliveryDays: 5,
    revisions: "Unlimited",
    features: ["1 page", "Responsive design", "Basic support"],
  },
  {
    name: "Standard",
    price: 500,
    packageType: "Standard Package",
    deliveryDays: 3,
    revisions: "Unlimited",
    features: ["3 pages", "Responsive design", "Priority support"],
  },
  {
    name: "Premium",
    price: 800,
    deliveryDays: 2,
    packageType: "Premium Package",
    revisions: "Unlimited",
    features: [
      "5+ pages",
      "Responsive design",
      "Priority support",
      "Performance optimization",
    ],
  },
];
