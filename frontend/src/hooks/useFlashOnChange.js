import { useState, useEffect, useRef } from 'react';

export default function useFlashOnChange(value, duration = 1000) {
  const [flashClass, setFlashClass] = useState('');
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (value > prevValueRef.current) {
        setFlashClass('bg-success/20 text-success rounded px-1 transition-colors');
      } else if (value < prevValueRef.current) {
        setFlashClass('bg-danger/20 text-danger rounded px-1 transition-colors');
      }
      
      prevValueRef.current = value;
      
      const timeout = setTimeout(() => {
        setFlashClass('transition-colors duration-500'); // Fades out
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [value, duration]);

  return flashClass;
}
