import type { JSX } from "react"


type ButtonProps = {
  text: string;
  bgColor: string;
  textColor: string;
  backdropColor: string;
};

function Button({ text, bgColor, textColor, backdropColor }: ButtonProps): JSX.Element {
  return (
    <button
      className={`flex justify-center items-center flex-nowrap rounded-md py-1.5 px-2.5 text-xs cursor-pointer font-normal bg-${bgColor} transition-transform duration-300 hover:scale-105 whitespace-nowrap ${backdropColor}`} style={{ color: textColor }}>
      {text}
    </button>
  );
}

export default Button;
