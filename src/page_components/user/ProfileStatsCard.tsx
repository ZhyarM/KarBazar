import { faSliders, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";

interface StatsProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  IconColor?: string;
  bg_color?: string;
  reviews?: number;
  rating?: number;
  projects?: number;
  completed_projects?: number;
  revenue?: number;
  total_earnings?: number;
  avgTime?: number;
  response_time?: number;
}

function StatsCard({
  icon = <FontAwesomeIcon icon={faStar} />,
  label = "default",
  value = "0",
  IconColor = "text-red-500",
  bg_color = "bg-amber-200",
  reviews,
  rating,
  projects,
  total_earnings,
  avgTime,
}: StatsProps) {
  return (
    // Changed w-1/4 to w-full so it fills the grid column defined in the parent
    // Changed h-48 to min-h-[180px] to allow expansion if text wraps
    <div className="bg-(--color-card) shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl w-full min-h-[180px] flex flex-col justify-between p-5 border border-(--color-border)">
      {/* Header: Icon & Menu */}
      <div className="flex justify-between items-start">
        {/* Dynamic Background Color applied correctly here */}
        <div
          className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl ${bg_color} ${IconColor}`}
        >
          {icon}
        </div>

        <button className="h-8 w-8 text-(--color-text-muted) hover:text-(--color-text) rounded-full hover:bg-(--color-surface) flex items-center justify-center transition-colors">
          <FontAwesomeIcon icon={faSliders} />
        </button>
      </div>

      {/* Body: Stats Info */}
      <div className="flex flex-col gap-1 mt-4">
        <h1 className="font-extrabold text-(--color-text) text-3xl tracking-tight">
          {value}
        </h1>
        <h2 className="text-(--color-text-muted) font-medium text-sm uppercase tracking-wider">
          {label}
        </h2>

        {/* Footer: Contextual Info */}
        <div className="text-xs font-semibold text-(--color-text-muted) mt-2">
          {reviews ? (
            <div className="flex items-center gap-1">
              <span className="text-(--color-text) font-bold">{reviews}</span>
              <span>reviews</span>
            </div>
          ) : null}

          {rating ? (
            <div className="flex items-center gap-1">
              <span className="text-(--color-text) font-bold">{rating}</span>
              <span>ratings</span>
            </div>
          ) : null}

          {projects ? (
            <div className="flex items-center gap-1">
              <span className="text-(--color-text) font-bold">{projects}</span>
              <span>projects</span>
            </div>
          ) : null}

          {total_earnings ? (
            <div className="flex items-center gap-1">
              <span className="text-green-500 font-bold">Free</span>
              <span>platform</span>
            </div>
          ) : null}

          {avgTime ? (
            <div className="flex items-center gap-1">
              <span className="text-(--color-text) font-bold">{avgTime}h</span>
              <span>avg time</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
