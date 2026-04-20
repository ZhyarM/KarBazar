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
import { useLanguage } from "../../context/LanguageContext.tsx";

function PlatformStats() {
  const { t } = useLanguage();

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
      text: t("stats.activeBusinesses"),
    },
    {
      icon: <FontAwesomeIcon icon={faBriefcase} />,
      numbers: formatCount(statsData?.projects_completed),
      text: t("stats.projectsCompleted"),
    },
    {
      icon: <FontAwesomeIcon icon={faDollarSign} />,
      numbers: formatCount(statsData?.projects_live),
      text: t("stats.projectsLive"),
    },
    {
      icon: <FontAwesomeIcon icon={faStar} />,
      numbers: `${statsData?.average_rating ?? 0}/5`,
      text: t("stats.averageRating"),
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
