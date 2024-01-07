import { Context, forwardRef, useContext, useImperativeHandle, useMemo, useRef } from 'react';
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

    const modifiedValues = useRef<Partial<TValues>>({});

    const baseValues: Partial<TValues> = root ? {} : parentCtx.values;

    const newValues: Partial<TValues> = {
      ...baseValues,
      ...values,
      ...modifiedValues.current,
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

    const refImpl: TRef = {
      modify(cb) {
        const modification = cb(valuesRef.current);
        Object.assign(modifiedValues.current, modification);
      },
      getValues() {
        return valuesRef.current;
      },
      track: trackFn,
    };

    useImperativeHandle(ref, () => refImpl, [valuesRef]);

    const content = typeof children === 'function' ? children(refImpl) : children;

    return <ctx.Provider value={ctxValue}>{content}</ctx.Provider>;
  });

  return { Tracking };
}
