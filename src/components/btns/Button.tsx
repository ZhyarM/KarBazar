import type { JSX, ReactNode } from "react";

type ButtonProps = {
  text?: React.ReactNode | string;
  bgColor?: string;
  textColor?: string;
  backdropColor?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
};

function Button({
  text,
  bgColor,
  textColor,
  backdropColor,
  icon,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        gap-1 flex-1 font-semibold cursor-pointer
        px-3.5 py-2 rounded-lg text-sm
        transition-all duration-300
        active:scale-95 select-none
        hover:scale-110
        ${bgColor} ${backdropColor} ${textColor}
      `}
    >
      {icon}{text}
    </button>
  );
}

export default Button;
