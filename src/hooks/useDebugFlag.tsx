import { useMemo } from 'react';

export function useDebugFlag() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === '1';
  }, []);
}