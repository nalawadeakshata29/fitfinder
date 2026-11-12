import { useState, useEffect } from 'react';

/**
 * Hook to persist state in localStorage with safe error handling
 * for environments where storage access might be blocked.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      const parsed = JSON.parse(item);
      // If initialValue is a plain object, merge to prevent missing fields
      if (
        typeof initialValue === 'object' &&
        initialValue !== null &&
        !Array.isArray(initialValue)
      ) {
        return { ...initialValue, ...parsed };
      }
      return parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Storage access blocked or quota exceeded
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;

