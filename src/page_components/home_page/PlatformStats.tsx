import {
  faBriefcase,
  faDollarSign,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getPublicStats, type PublicStats } from "../../API/StatsAPI";

function PlatformStats() {
  type Stats = {
    icon: ReactNode;
    numbers: string;
    text: string;
  };

  const [statsData, setStatsData] = useState<PublicStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getPublicStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to load platform stats:", error);
      }
    };

    loadStats();
  }, []);

  const formatCount = (value?: number) => {
    if (!value || value <= 0) return "0";
    return value.toLocaleString();
  };

  const stats: Stats[] = [
    {
      icon: <FontAwesomeIcon icon={faUsers} />,
      numbers: formatCount(statsData?.active_businesses),
      text: "Active Businesses",
    },
    {
      icon: <FontAwesomeIcon icon={faBriefcase} />,
      numbers: formatCount(statsData?.projects_completed),
      text: "Projects Completed",
    },
    {
      icon: <FontAwesomeIcon icon={faDollarSign} />,
      numbers: formatCount(statsData?.projects_live),
      text: "Projects Live on Website",
    },
    {
      icon: <FontAwesomeIcon icon={faStar} />,
      numbers: `${statsData?.average_rating ?? 0}/5`,
      text: "Average Rating",
    },
  ];

  return (
    <>
      <section className="w-full flex justify-around items-center flex-wrap gap-4 px-2 py-16 bg-(--color-bg)">
        {stats.map((el) => (
          <div
            key={el.text}
            className="flex flex-col items-center justify-center gap-2 p-3"
          >
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
