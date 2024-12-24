import { useCallback, useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  }, []);

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  const handleChange = useCallback(() => {
    setMatches(getMatches(query));
  }, [query, getMatches]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
    ) {
      const matchMedia = window.matchMedia(query);

      // Check and set initial state
      handleChange();

      // Define a fallback for older browsers
      const addListener = matchMedia.addEventListener;
      const removeListener = matchMedia.removeEventListener;

      // Listen for changes
      addListener.call(matchMedia, 'change', handleChange);

      // Cleanup
      return () => removeListener.call(matchMedia, 'change', handleChange);
    }
  }, [query, handleChange]);

  return matches;
}
