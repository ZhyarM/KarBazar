import type { ReactElement } from "react";
import { useTheme } from "../context/ThemeContext";

type CardProps = {
  logo: ReactElement;
  text: string;
};

function Card({ logo, text }: CardProps) {
  const { isBgLight } = useTheme();

  return (
    <>
      <div
        className={`
    flex flex-col
    gap-6
    py-6
    border ${
      isBgLight ? "border-[oklch(0.83_0_0)]" : "border-[oklch(0.30_0_0)]"
    }
    w-[360px] h-[211px]
    font-inter text-lg leading-6
    text-[oklch(0.98_0_0)]
    bg-transparent
    rounded-xl
    shadow-lg
    group transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:border-blue-500
    cursor-pointer
  `}
      >
        <div
          className="
      flex flex-col justify-center items-center
      gap-3.5
      p-6
      text-center
      text-[oklch(0.98_0_0)]
    "
        >
          <span
            className="text-xl text-center text-[oklch(0.707_0.165_254.624)] rounded-full p-2.5 bg-[oklab(0.379_-0.0113991_-0.145554/0.3)] transition-transform duration-200
  group-hover:scale-110"
          >
            {logo}
          </span>

          <p
            className={`text-xl font-medium ${
              isBgLight
                ? "text-[oklch(0.15_0.05_264)]"
                : "text-[oklch(0.92_0.025_264)]"
            }`}
          >
            {text}
          </p>
        </div>
      </div>
    </>
  );
}

export default Card;
