import type { JSX } from "react"

type inputProps = {
    icon: string | "";
    label: string;
    type: "text";
    placeholder: string;
    size: "sm" | "md" | "lg";


}


export default function Input({
    icon = "",
    label,
    type = "text",
    placeholder = "",
    size= "md"
}: inputProps): JSX.Element{
    return (
        <div className={`flex flex-row align-baseline gap-1 w-${size}`}>
            <img src={icon} width={40} height={40} alt="" />
            <div className="flex flex-col align-baseline">
                <label>{label}</label>
                <input type={type} placeholder={placeholder} />
            </div>


        </div>
    );
}

