import Button from "../../components/btns/Button.tsx";
import * as Slider from "@radix-ui/react-slider";
import type { FilterConfig } from "../../config/filters.config";

interface FiltersProps {
  config: FilterConfig[];
  value: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onReset: () => void;
  onApply: () => void;
}

function FilterHeader({ config, value, onChange, onReset, onApply }: FiltersProps) {
  return (
    <section className="w-full bg-(--color-bg) border-b border-(--color-border) py-4 sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-4">
            {config.map((filter) => (
              <div key={filter.id} className="flex flex-col gap-2 min-w-0 lg:w-[190px]">
                <label className="text-xs uppercase tracking-widest text-(--color-text-muted) font-bold px-1">
                  {filter.label}
                </label>

                {filter.type === "select" && (
                  <div className="relative group">
                    <select
                      value={value[filter.id]}
                      onChange={(e) => onChange(filter.id, e.target.value)}
                      className="w-full bg-(--color-surface) border border-(--color-border) text-(--color-text) text-sm rounded-md pl-3 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-all appearance-none cursor-pointer shadow-(--shadow-sm)"
                    >
                      <option value="">All {filter.label}</option>
                      {filter.options?.map((opt) => (
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
                )}

                {filter.type === "range" && (
                  <>
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5"
                      value={value[filter.id]}
                      min={filter.min}
                      max={filter.max}
                      step={filter.step}
                      onValueChange={(val) => onChange(filter.id, val)}
                    >
                      <Slider.Track className="relative bg-(--color-border) grow rounded-full h-1">
                        <Slider.Range className="absolute bg-(--color-primary) rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-4 h-4 bg-(--color-bg) border-2 border-(--color-primary) rounded-full shadow-md focus:outline-none hover:scale-110 transition-transform cursor-grab active:cursor-grabbing" />
                      <Slider.Thumb className="block w-4 h-4 bg-(--color-bg) border-2 border-(--color-primary) rounded-full shadow-md focus:outline-none hover:scale-110 transition-transform cursor-grab active:cursor-grabbing" />
                    </Slider.Root>

                    <div className="flex justify-between mt-1 text-xs font-bold">
                      <span className="text-(--color-primary)">${value[filter.id][0]}</span>
                      <span className="text-(--color-primary)">
                        {value[filter.id][1] === 1000
                          ? `$${value[filter.id][1] / 1000}k+`
                          : `$${value[filter.id][1]}`}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="col-span-2 sm:col-span-3 w-full flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3 lg:w-auto lg:flex-row lg:items-center">
              <div className="w-full sm:w-auto">
                <Button
                  onClick={onReset}
                  text="Reset"
                  bgColor="bg-transparent w-full sm:w-auto"
                  textColor="text-(--color-text-muted)"
                  backdropColor="hover:bg-(--color-border)"
                />
              </div>
              <div className="w-full sm:w-auto">
                <Button
                  onClick={onApply}
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
