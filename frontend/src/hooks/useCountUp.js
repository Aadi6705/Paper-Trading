import { useState, useEffect, useRef } from 'react';

export default function useCountUp(targetValue, durationMs = 500) {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const targetRef = useRef(targetValue);
  const startRef = useRef(targetValue);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Treat null/undefined gracefully, or if there's no actual change
    if (targetValue == null || targetRef.current === targetValue) {
      if (targetValue != null && currentValue !== targetValue) {
         setCurrentValue(targetValue);
      }
      return; 
    }

    startRef.current = currentValue;
    targetRef.current = targetValue;
    startTimeRef.current = performance.now();

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);

      // easeOutQuart curve for a smooth snap-in
      const ease = 1 - Math.pow(1 - progress, 4);
      const nextValue = startRef.current + (targetRef.current - startRef.current) * ease;

      setCurrentValue(nextValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetRef.current);
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [targetValue, durationMs, currentValue]);

  return currentValue;
}
