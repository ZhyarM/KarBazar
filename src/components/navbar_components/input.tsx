import type { JSX } from "react"

type inputProps = {
    icon: string | "";
    label: string;
    placeholder: string;
  size: "1/2" | "1/3" | "full";
  onChange?: (value: string) => void
  type: string;


}


export default function Input({
    label,
    placeholder = "",
  size = "full",
  onChange,
  type = "text",
}: inputProps): JSX.Element{
    return (
      <div
        className={`flex flex-col align-baseline relative p-2 font-bold  text-md pl-2 border border-(--color-border) w-${size} input-focus  rounded-xl `}
      >
        <label className="bg-transparent absolute -top-6 label text-(--color-text-inverse) opacity-80 ">
          {label}
        </label>
        <input
          className="focus:outline-none placeholder-gray-400 text-(--color-text-inverse)  "
          type={type}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    );
}

