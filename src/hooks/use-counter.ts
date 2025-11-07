"use client";

import { useState, useEffect, useRef } from 'react';

export const useCounter = (endValue: number, duration: number) => {
  const [count, setCount] = useState(0);
  const startValue = 0;
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    let frame = 0;
    
    const counter = () => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(startValue + (endValue - startValue) * progress);

      setCount(currentCount);

      if (frame < totalFrames) {
        animationFrameId.current = requestAnimationFrame(counter);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId.current = requestAnimationFrame(counter);

    return () => {
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [endValue, duration, totalFrames]);

  return count;
};
