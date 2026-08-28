import React from 'react';
import useCountUp from '../hooks/useCountUp';

export default function CountUp({ value, valueOverride, duration = 500, prefix = '', suffix = '', decimals = 2 }) {
  const animatedValue = useCountUp(value, duration);
  
  // Use valueOverride if provided, calculating proportion of animated vs target
  const displayValue = valueOverride !== undefined && value !== 0 
    ? (animatedValue / value) * valueOverride 
    : animatedValue;

  return (
    <span>
      {prefix}
      {displayValue != null ? displayValue.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '--'}
      {suffix}
    </span>
  );
}
