import { useRef } from 'react';

type Option = {
  ref: React.RefObject<HTMLElement | null>;
  start: number;
  end: number;
  duration?: number;
  onEnd?: () => void;
};

// 0 <= t <= 1
const easeOut = (t: number) => {
  return Math.log10(9 * t + 1);
};

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const useCountUp = (option: Option) => {
  const duration = option.duration ?? 2;
  const { ref, start: startValue, end: endValue, onEnd } = option;
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const start = () => {
    clearInterval(intervalRef.current);

    let t = 0;
    intervalRef.current = setInterval(() => {
      const element = ref.current;
      if (!element) return;
      t += 1 / (60 * duration);
      if (t >= 1) t = 1;
      const easedValue = easeOut(t);
      const currentValue = Math.round(startValue + (endValue - startValue) * easedValue);
      element.textContent = formatNumber(currentValue);
      if (t === 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
        onEnd?.();
      }
    }, 1000 / 60);
  };

  return { start };
};
