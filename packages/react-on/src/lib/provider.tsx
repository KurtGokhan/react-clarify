import { Context, forwardRef, useContext, useImperativeHandle, useMemo } from 'react';
import { useStable } from '../hooks/use-stable';
import { useStableCallback } from '../hooks/use-stable-callback';
import { ReactOn, ReactOnBase, TrackFn, TrackingContext, TrackingProps, TrackingRef, TrackingValues } from '../types';

export function createTrackingProvider<TBase extends ReactOnBase = ReactOn>(
  ctx: Context<TrackingContext<TBase>>,
  useTrack: () => TrackFn<TBase>,
) {
  type TValues = TrackingValues<TBase>;
  type TRef = TrackingRef<TBase>;
  type TProps = TrackingProps<TBase>;
  type TTrackFn = TrackFn<TBase>;

  const Tracking = forwardRef<TRef, TProps>(function _Tracking({ children, enabled, skip, root, values }, ref) {
    const parentCtx = useContext(ctx);

    const baseValues: Partial<TValues> = root ? {} : parentCtx.values;
    const newValues =
      typeof values === 'function'
        ? values(parentCtx.values)
        : {
            ...baseValues,
            ...values,
          };

    const currentValues = skip ? baseValues : newValues;
    const valuesRef = useStable(currentValues);
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

    const track = useTrack();
    const trackFn = useStableCallback<TTrackFn>(({ args, values }) =>
      track({ values: { ...currentValues, ...values }, args }),
    );

    const refImpl = useStable<TRef>({
      getValues() {
        return valuesRef.current;
      },
      track: trackFn,
    });

    useImperativeHandle(ref, () => refImpl.current, [refImpl]);

    const content = typeof children === 'function' ? children(refImpl.current) : children;

    return <ctx.Provider value={ctxValue}>{content}</ctx.Provider>;
  });

  return { Tracking };
}
