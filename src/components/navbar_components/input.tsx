import type { JSX } from "react";

type inputProps = {
  icon?: string | "";
  label: string;
  placeholder: string;
  size?: "1/2" | "1/3" | "full";
  onChange?: (value: string) => void;
  type?: string;
  value?: string;
  error?: string;
  prefix?: string;
};

export default function Input({
  label,
  placeholder = "",
  size = "full",
  onChange,
  type = "text",
  value = "",
  error = "",
  prefix,
}: inputProps): JSX.Element {
  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-col align-baseline relative p-2 font-bold  text-md pl-2 border w-${size} input-focus  rounded-xl transition-colors ${
          error
            ? "border-red-500 bg-red-50 dark:bg-red-900 dark:bg-opacity-20"
            : "border-(--color-border)"
        }`}
      >
        <label className="bg-transparent absolute -top-6 label text-(--color-text-inverse) opacity-80 ">
          {label}
        </label>
        {prefix ? (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-inverse) opacity-80 pointer-events-none">
            {prefix}
          </span>
        ) : null}
        <input
          className={`focus:outline-none placeholder-gray-400 text-(--color-text-inverse) bg-transparent w-full ${
            prefix ? "pl-5" : ""
          }`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>}
    </div>
  );
}
