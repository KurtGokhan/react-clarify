import { Context, forwardRef, useContext, useImperativeHandle, useMemo, useRef } from 'react';
import { useCurrent } from '../hooks/use-current';
import { ReactOn, ReactOnBase, TrackingContext, TrackingProps, TrackingRef, TrackingValues } from '../types';

export function createTrackingProvider<TBase extends ReactOnBase = ReactOn>(ctx: Context<TrackingContext<TBase>>) {
  type TValues = TrackingValues<TBase>;
  type TRef = TrackingRef<TBase>;
  type TProps = TrackingProps<TBase>;

  const Tracking = forwardRef<TRef, TProps>(function _Tracking({ children, enabled, skip, root, values }, ref) {
    const parentCtx = useContext(ctx);

    const modifiedValues = useRef<Partial<TValues>>({});

    const baseValues: Partial<TValues> = root ? {} : parentCtx.values;

    const newValues: Partial<TValues> = {
      ...baseValues,
      ...values,
      ...modifiedValues.current,
    };

    const valuesRef = useCurrent(skip ? baseValues : newValues);
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
        },
      }),
      [valuesRef],
    );

    return <ctx.Provider value={ctxValue}>{children}</ctx.Provider>;
  });

  return { Tracking };
}
