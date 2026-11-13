import { useState, useEffect } from "react";
import { Clock, Flame } from "lucide-react";

interface CountdownTimerProps {
  endDate: Date;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ endDate, compact = false }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = endDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) return null;

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-destructive/[0.06] border border-destructive/15 text-destructive px-2 py-1 rounded-md text-xs font-semibold tabular-nums">
        <Clock className="h-3 w-3" />
        <span>
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-destructive/[0.06] border border-destructive/15 p-3">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Flame className="h-4 w-4 text-destructive" />
        <span className="text-xs font-bold text-destructive uppercase tracking-wider">
          ¡Oferta termina en!
        </span>
        <Flame className="h-4 w-4 text-destructive" />
      </div>
      
      <div className="flex items-center justify-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <div className="bg-background border border-destructive/15 rounded-lg px-2 py-1 min-w-[2.5rem] text-center">
                <span className="text-lg font-bold text-foreground tabular-nums">{formatNumber(timeLeft.days)}</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">DÍAS</span>
            </div>
            <span className="text-destructive/50 font-bold text-lg pb-4">:</span>
          </>
        )}
        
        <div className="flex flex-col items-center">
          <div className="bg-background border border-destructive/15 rounded-lg px-2 py-1 min-w-[2.5rem] text-center">
            <span className="text-lg font-bold text-foreground tabular-nums">{formatNumber(timeLeft.hours)}</span>
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">HRS</span>
        </div>
        <span className="text-destructive/50 font-bold text-lg pb-4">:</span>
        
        <div className="flex flex-col items-center">
          <div className="bg-background border border-destructive/15 rounded-lg px-2 py-1 min-w-[2.5rem] text-center">
            <span className="text-lg font-bold text-foreground tabular-nums">{formatNumber(timeLeft.minutes)}</span>
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">MIN</span>
        </div>
        <span className="text-destructive/50 font-bold text-lg pb-4">:</span>
        
        <div className="flex flex-col items-center">
          <div className="bg-background border border-destructive/15 rounded-lg px-2 py-1 min-w-[2.5rem] text-center">
            <span className="text-lg font-bold text-foreground tabular-nums">{formatNumber(timeLeft.seconds)}</span>
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">SEG</span>
        </div>
      </div>
    </div>
  );
};
