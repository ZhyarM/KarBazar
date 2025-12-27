import { useState } from "react";
import Button from "../../components/btns/Button.tsx";
import * as Slider from "@radix-ui/react-slider";

type inputType = "select" | "range";

interface FilterGroup {
  id: string;
  title: string;
  type: inputType;
  options?: string[];
  min?: number;
  max?: number;
}

const sidebarFilters: FilterGroup[] = [
  {
    id: "category",
    title: "Category",
    type: "select",
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
    title: "Seller Level",
    type: "select",
    options: ["Top Rated Seller", "Level 2", "Level 1", "New Seller"],
  },
  {
    id: "budget",
    title: "Budget",
    type: "range",
    min: 0,
    max: 1000,
  },
  {
    id: "deliveryTime",
    title: "Delivery Time",
    type: "select",
    options: ["Express 24H", "Up to 3 days", "Up to 7 days", "Anytime"],
  },
];

function FilterHeader() {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 1000]);

  const handleSelectChange = (groupId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupId]: value }));
  };

  const clearFilters = () => {
    setSelectedOptions({});
    setBudgetRange([0, 1000]);
  };

  return (
    <section className="w-full bg-(--color-bg) border-b border-(--color-border) py-4 sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-4 ">
            {sidebarFilters.map((group) => (
              <div
                key={group.id}
                className="flex flex-col gap-2 min-w-0 lg:w-[190px]"
              >
                <label className="text-xs uppercase tracking-widest text-(--color-text-muted) font-bold px-1">
                  {group.title}
                </label>

                {group.type === "select" ? (
                  <div className="relative group">
                    <select
                      value={selectedOptions[group.id] || ""}
                      onChange={(e) =>
                        handleSelectChange(group.id, e.target.value)
                      }
                      className="w-full bg-(--color-surface) border border-(--color-border) text-(--color-text) text-sm rounded-md pl-3 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-all appearance-none cursor-pointer shadow-(--shadow-sm)"
                    >
                      <option value="">All {group.title}</option>
                      {group.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--color-text-muted)">
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5"
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      max={group.max}
                      min={group.min}
                      step={5}
                    >
                      <Slider.Track className="relative bg-(--color-border)  grow rounded-full h-1">
                        {/* The Main track */}
                        <Slider.Range className="absolute bg-(--color-primary) rounded-full h-full" />{" "}
                        {/* The acitve part of the Main track */}
                      </Slider.Track>

                      <Slider.Thumb className="block w-4 h-4 bg-(--color-bg) border-2 border-(--color-primary) rounded-full shadow-md focus:outline-none hover:scale-110 transition-transform cursor-grab active:cursor-grabbing" />
                      <Slider.Thumb className="block w-4 h-4 bg-(--color-bg) border-2 border-(--color-primary) rounded-full shadow-md focus:outline-none hover:scale-110 transition-transform cursor-grab active:cursor-grabbing" />
                    </Slider.Root>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs font-bold text-(--color-primary)">
                        ${budgetRange[0]}
                      </span>
                      <span className="text-xs font-bold text-(--color-primary)">
                        {budgetRange[1] === 1000
                          ? `$${budgetRange[1] / 1000}k+`
                          : `$${budgetRange[1]}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3 w-full flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3 lg:w-auto lg:flex-row lg:items-center">
              <div className="w-full sm:w-auto">
                <Button
                  onClick={clearFilters}
                  text="Reset"
                  bgColor="bg-transparent w-full sm:w-auto"
                  textColor="text-(--color-text-muted)"
                  backdropColor="hover:bg-(--color-border)"
                />
              </div>
              <div className="w-full sm:w-auto">
                <Button
                  onClick={() => console.log({ selectedOptions, budgetRange })}
                  text="Apply Filters"
                  bgColor="bg-(--color-primary) w-full sm:w-auto"
                  textColor="text-(--color-text-inverse)"
                  backdropColor=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FilterHeader;
