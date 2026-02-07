import type { JSX, ReactNode } from "react";

type ButtonProps = {
  text?: React.ReactNode | string;
  bgColor?: string;
  textColor?: string;
  backdropColor?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
  hover?: string
  bold ?: string;
};

function Button({
  text,
  bgColor,
  textColor,
  backdropColor,
  icon,
  hover,
  onClick,
  bold ,
}: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`
        ${bold ? bold : "font-semibold"}
        flex items-center justify-center
        gap-1 flex-1  cursor-pointer
        px-3.5 py-2 rounded-lg text-sm
        transition-all duration-300
        active:scale-95 select-none
        hover:scale-105

       ${hover} ${bgColor} ${backdropColor} ${textColor}
      `}
    >
      {icon}
      {text}
    </button>
  );
}

export default Button;
