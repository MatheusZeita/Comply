import { useState, useEffect } from "react";

function calculateTimeLeft(endDate: string) {
  const difference = +new Date(endDate) - +new Date();

  if (difference <= 0) {
    return "Encerrado";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  let parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (days === 0 && hours === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}

export const AuctionCountdown = ({
  endDate,
}: {
  endDate: string | null | undefined;
}) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(
    endDate ? calculateTimeLeft(endDate) : null
  );

  useEffect(() => {
    if (!endDate) {
      setTimeLeft(null);
      return;
    }

    const updateCountdown = () => {
      const result = calculateTimeLeft(endDate);
      setTimeLeft(result);
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endDate]);
  if (!endDate || !timeLeft || timeLeft === "Encerrado") {
    return null;
  }

  return timeLeft.trim();
};
