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
      className={`h-8 flex font-bold justify-center items-center flex-nowrap gap-1 rounded-md py-1.5 px-2.5 text-s cursor-pointer ${bgColor} transition-transform duration-300 hover:scale-105 whitespace-nowrap ${backdropColor}`}
      style={{ color: textColor }}
    >
      {text}
    </button>
  );
}

export default Button;
