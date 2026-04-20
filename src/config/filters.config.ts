export type FilterType = "select" | "range";

export interface FilterOption {
  value: string;
  labelKey: string;
}

export interface FilterConfig {
  id: string;
  labelKey: string;
  type: FilterType;
  defaultValue: any;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

export const filtersConfig: FilterConfig[] = [
  {
    id: "category",
    labelKey: "browseGigs.filters.category",
    type: "select",
    defaultValue: "",
    options: [
      {
        value: "Graphics & Design",
        labelKey: "browseGigs.filters.option.category.graphicsDesign",
      },
      {
        value: "Programming & Tech",
        labelKey: "browseGigs.filters.option.category.programmingTech",
      },
      {
        value: "Digital Marketing",
        labelKey: "browseGigs.filters.option.category.digitalMarketing",
      },
      {
        value: "Video & Animation",
        labelKey: "browseGigs.filters.option.category.videoAnimation",
      },
      {
        value: "Writing & Translation",
        labelKey: "browseGigs.filters.option.category.writingTranslation",
      },
      {
        value: "Music & Audio",
        labelKey: "browseGigs.filters.option.category.musicAudio",
      },
    ],
  },
  {
    id: "sellerLevel",
    labelKey: "browseGigs.filters.sellerLevel",
    type: "select",
    defaultValue: "",
    options: [
      {
        value: "Top Rated Seller",
        labelKey: "browseGigs.filters.option.sellerLevel.topRated",
      },
      {
        value: "Level 2",
        labelKey: "browseGigs.filters.option.sellerLevel.level2",
      },
      {
        value: "Level 1",
        labelKey: "browseGigs.filters.option.sellerLevel.level1",
      },
      {
        value: "New Seller",
        labelKey: "browseGigs.filters.option.sellerLevel.newSeller",
      },
    ],
  },
  {
    id: "budget",
    labelKey: "browseGigs.filters.budget",
    type: "range",
    defaultValue: [0, 1000],
    min: 0,
    max: 1000,
    step: 5,
  },
  {
    id: "deliveryTime",
    labelKey: "browseGigs.filters.deliveryTime",
    type: "select",
    defaultValue: "",
    options: [
      {
        value: "Express 24H",
        labelKey: "browseGigs.filters.option.delivery.express24h",
      },
      {
        value: "Up to 3 days",
        labelKey: "browseGigs.filters.option.delivery.upTo3Days",
      },
      {
        value: "Up to 7 days",
        labelKey: "browseGigs.filters.option.delivery.upTo7Days",
      },
      {
        value: "Anytime",
        labelKey: "browseGigs.filters.option.delivery.anytime",
      },
    ],
  },
];
