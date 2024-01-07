import { useCallback } from 'react';
import { useStable } from './use-stable';

export function useStableCallback<T extends (...args: any[]) => any>(callback?: T) {
  const callbackRef = useStable(callback);
  return useCallback((...args: Parameters<T>) => callbackRef.current?.(...args) as ReturnType<T>, [callbackRef]);
}
