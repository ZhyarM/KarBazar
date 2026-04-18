import type { ReactElement } from "react";


type CardProps = {
  logo: ReactElement;
  text: string;
};

function Card({ logo, text }: CardProps) {

  return (
    <>
      <div
        className={`
    flex flex-col
    gap-6
    py-6
    border border-(--color-border)
    w-[360px] h-[211px]
    font-inter text-lg leading-6
    text-(--color-text)
    bg-(--color-surface)
    rounded-xl
    shadow-lg
    group transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:border-(--color-accent-hover)
    cursor-pointer
  `}
      >
        <div
          className="
      flex flex-col justify-center items-center
      gap-3.5
      p-6
      text-center
      text-(--color-text)
    "
        >
          <span
            className="flex items-center justify-center text-xl text-center text-(--color-secondary) rounded-full h-14 w-14 bg-(--color-primary) transition-transform duration-200
  group-hover:scale-110"
          >
            {logo}
          </span>

          <p className={`text-xl font-medium text-(--color-text)`}>{text}</p>
        </div>
      </div>
    </>
  );
}

export default Card;
