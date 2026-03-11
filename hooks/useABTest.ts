'use client';

import { useState, useEffect } from 'react';

type Variant = 'A' | 'B';

export function useABTest(experimentName: string): Variant {
  const [variant, setVariant] = useState<Variant>('A'); // Default to A during SSR to prevent hydration mismatch

  useEffect(() => {
    // Check if variant is already stored in localStorage
    const storedVariant = localStorage.getItem(`ab_test_${experimentName}`);
    
    if (storedVariant === 'A' || storedVariant === 'B') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVariant(storedVariant as Variant);
    } else {
      // Randomly assign and store Variant A or B (50/50 split)
      const randomVariant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem(`ab_test_${experimentName}`, randomVariant);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVariant(randomVariant);
    }
  }, [experimentName]);

  return variant;
}
