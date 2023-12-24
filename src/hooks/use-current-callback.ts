import { useCallback } from 'react';
import { useCurrent } from './use-current';

export function useCurrentCallback<T extends (...args: any[]) => any>(callback?: T) {
  const callbackRef = useCurrent(callback);
  return useCallback((...args: Parameters<T>) => callbackRef.current?.(...args) as ReturnType<T>, [callbackRef]);
}
