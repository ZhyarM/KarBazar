import {
  faBriefcase,
  faDollarSign,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

function PlatformStats() {
  type Stats = {
    icon: ReactNode;
    numbers: string;
    text: string;
  };
  const stats: Stats[] = [
    {
      icon: <FontAwesomeIcon icon={faUsers} />,
      numbers: "50,000+",
      text: "Active Freelancers",
    },
    {
      icon: <FontAwesomeIcon icon={faBriefcase} />,
      numbers: "1M+",
      text: "Projects Completed",
    },
    {
      icon: <FontAwesomeIcon icon={faDollarSign} />,
      numbers: "$100M+",
      text: "Total Earnings",
    },
    {
      icon: <FontAwesomeIcon icon={faStar} />,
      numbers: "4.5/5",
      text: "Average Rating",
    },
  ];

  return (
    <>
      <section className="w-full flex justify-around items-center flex-wrap gap-4 px-2 py-16 bg-(--color-bg)">
        {stats.map((el) => (
          <div className="flex flex-col items-center justify-center gap-2 p-3">
            <span
              className="
                        w-15 h-15
                        rounded-full
                        flex items-center justify-center
                        text-3xl
                        bg-(image:--gradient-secondary) transition duration-200 hover:-translate-y-1"
            >
              {el.icon}
            </span>
            <p className="subsection-title text-(--color-text)">{el.numbers}</p>
            <p className="small-title text-(--color-text)">{el.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export default PlatformStats;
