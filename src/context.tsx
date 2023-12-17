import { createContext, forwardRef, ReactNode, useContext, useImperativeHandle, useMemo, useRef } from 'react';
import { useLatest } from './hooks/use-latest';
import { TrackingValues } from './types';

interface TrackingContext {
  readonly enabled: boolean;
  readonly values: Readonly<TrackingValues>;
}

const ctx = createContext<TrackingContext>({ enabled: true, values: {} });
const TrackingContextProvider = ctx.Provider;

export const useTrackingContext = () => useContext(ctx);

export interface TrackingProps {
  enabled?: boolean;
  skip?: boolean;
  root?: boolean;
  values?: Partial<TrackingValues>;
  children?: ReactNode;
}

export interface TrackingRef {
  modify: (cb: (val: Readonly<TrackingValues>) => Partial<TrackingValues>) => void;
  values: Partial<TrackingValues>;
}

export const Tracking = forwardRef<TrackingRef, TrackingProps>(function _Tracking(
  { children, enabled, skip, root, values },
  ref,
) {
  const parentCtx = useTrackingContext();

  const modifiedValues = useRef<Partial<TrackingValues>>({});

  const baseValues = root ? {} : parentCtx.values;

  const newValues: Partial<TrackingValues> = {
    ...baseValues,
    ...values,
    ...modifiedValues.current,
  };

  const valuesRef = useLatest(skip ? baseValues : newValues);
  const newEnabled = typeof enabled === 'boolean' ? enabled : parentCtx.enabled;

  const ctxValue = useMemo<TrackingContext>(
    () => ({
      enabled: newEnabled,
      get values() {
        return valuesRef.current;
      },
    }),
    [newEnabled, valuesRef],
  );

  useImperativeHandle(
    ref,
    () => ({
      modify(cb) {
        const modification = cb(valuesRef.current);
        Object.assign(modifiedValues.current, modification);
      },
      get values() {
        return valuesRef.current;
      }
    }),
    [valuesRef],
  );

  return <TrackingContextProvider value={ctxValue}>{children}</TrackingContextProvider>;
});
