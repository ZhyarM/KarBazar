import type { JSX } from "react"

type inputProps = {
    icon: string | "";
    label: string;
    placeholder: string;
    size: "1/2" | "1/3" | "full";


}


export default function Input({
    label,
    placeholder = "",
    size= "full"
}: inputProps): JSX.Element{
    return (
      <div
        className={`flex flex-col align-baseline relative p-2 pl-2 border w-${size} input-text  `}
      >
        <label className="bg-transparent absolute -top-6 label ">{label}</label>
        <input
          className="focus:outline-none placeholder-(--color-text) "
          type="text"
          placeholder={placeholder}
        />
      </div>
    );
}

