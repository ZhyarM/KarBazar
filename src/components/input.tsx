import type { JSX } from "react"

type inputProps = {
    icon: string | "";
    label: string;
    placeholder: string;
  size: "1/2" | "1/3" | "full";
    onChange?: (value:string)=>void


}


export default function Input({
    label,
    placeholder = "",
  size = "full",
    onChange,
}: inputProps): JSX.Element{
    return (
      <div
        className={`flex flex-col align-baseline relative p-2 font-bold  text-md pl-2 border w-${size} input-text  `}
      >
        <label className="bg-transparent absolute -top-6 label ">{label}</label>
        <input
          className="focus:outline-none placeholder-gray-400 "
          type="text"
          placeholder={placeholder}
          onChange={(e)=>onChange?.(e.target.value)}
        />
      </div>
    );
}

