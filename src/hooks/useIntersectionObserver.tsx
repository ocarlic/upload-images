import { useEffect, useState } from 'react';

interface IntersectionObserverProps {
  onIntersect: () => void;
  options?: IntersectionObserverInit;
  enabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useIntersectionObserver({
  onIntersect,
  options,
  enabled,
}: IntersectionObserverProps) {
  const [ref, setRef] = useState(null);

  function handleIntersection([entry]: IntersectionObserverEntry[]) {
    if (entry.isIntersecting) {
      onIntersect();
    }
  }

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, options);

    if (ref) {
      observer.observe(ref);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  });

  return [setRef];
}
