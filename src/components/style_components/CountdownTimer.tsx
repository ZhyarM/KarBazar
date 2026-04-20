import { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiryDate: string;
  className?: string;
}

const formatCountdown = (expiryDate: string) => {
  const target = new Date(expiryDate).getTime();
  const now = Date.now();
  const distance = target - now;

  if (distance <= 0) {
    return "Expired";
  }

  const totalMinutes = Math.floor(distance / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

function CountdownTimer({ expiryDate, className = "" }: CountdownTimerProps) {
  const [label, setLabel] = useState(() => formatCountdown(expiryDate));

  useEffect(() => {
    setLabel(formatCountdown(expiryDate));
    const timer = window.setInterval(() => {
      setLabel(formatCountdown(expiryDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiryDate]);

  return <span className={className}>{label}</span>;
}

export default CountdownTimer;
