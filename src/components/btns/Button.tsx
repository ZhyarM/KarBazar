import type { JSX } from "react";

type ButtonProps = {
  text: React.ReactNode | string;
  bgColor: string;
  textColor: string;
  backdropColor: string;
};

function Button({
  text,
  bgColor,
  textColor,
  backdropColor,
}: ButtonProps): JSX.Element {
  return (
    <button
      className={`
        flex items-center justify-center
        gap-1 font-semibold cursor-pointer
        px-3.5 py-2 rounded-lg text-sm
        transition-all duration-300
        active:scale-95 select-none
        hover:scale-110
        ${bgColor} ${backdropColor} ${textColor}
      `}
    >
      {text}
    </button>
  );
}

export default Button;
