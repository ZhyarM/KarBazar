export type FilterType = "select" | "range";

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  defaultValue: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export const filtersConfig: FilterConfig[] = [
  {
    id: "category",
    label: "Category",
    type: "select",
    defaultValue: "",
    options: [
      "Graphics & Design",
      "Programming & Tech",
      "Digital Marketing",
      "Video & Animation",
      "Writing & Translation",
      "Music & Audio",
    ],
  },
  {
    id: "sellerLevel",
    label: "Seller Level",
    type: "select",
    defaultValue: "",
    options: ["Top Rated Seller", "Level 2", "Level 1", "New Seller"],
  },
  {
    id: "budget",
    label: "Budget",
    type: "range",
    defaultValue: [0, 1000],
    min: 0,
    max: 1000,
    step: 5,
  },
  {
    id: "deliveryTime",
    label: "Delivery Time",
    type: "select",
    defaultValue: "",
    options: ["Express 24H", "Up to 3 days", "Up to 7 days", "Anytime"],
  },
];
