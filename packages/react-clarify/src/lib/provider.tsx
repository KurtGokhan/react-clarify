import type { Context } from 'react';
import { forwardRef, useContext, useImperativeHandle, useMemo } from 'react';
import { useStable } from '../hooks/use-stable';
import { useStableCallback } from '../hooks/use-stable-callback';
import type {
  ReactClarify,
  ReactClarifyBase,
  TrackFn,
  TrackingContext,
  TrackingData,
  TrackingProps,
  TrackingRef,
} from '../types';

export function createTrackingProvider<TBase extends ReactClarifyBase = ReactClarify>(
  ctx: Context<TrackingContext<TBase>>,
  useTrack: () => TrackFn<TBase>,
) {
  type TData = TrackingData<TBase>;
  type TRef = TrackingRef<TBase>;
  type TProps = TrackingProps<TBase>;
  type TTrackFn = TrackFn<TBase>;

  const Tracking = forwardRef<TRef, TProps>(function _Tracking({ children, enabled, skip, root, data }, ref) {
    const parentCtx = useContext(ctx);

    const baseData: Partial<TData> = root ? {} : parentCtx.data;
    const newData =
      typeof data === 'function'
        ? data(parentCtx.data)
        : {
            ...baseData,
            ...data,
          };

    const currentData = skip ? baseData : newData;
    const dataRef = useStable(currentData);
    const newEnabled = typeof enabled === 'boolean' ? enabled : parentCtx.enabled;

    const ctxValue = useMemo<TrackingContext>(
      () => ({
        enabled: newEnabled,
        get data() {
          return dataRef.current;
        },
      }),
      [newEnabled, dataRef],
    );

    const track = useTrack();
    const trackFn = useStableCallback<TTrackFn>(({ args, data }) => track({ data: { ...currentData, ...data }, args }));

    const refImpl = useStable<TRef>({
      getData() {
        return dataRef.current;
      },
      track: trackFn,
    });

    useImperativeHandle(ref, () => refImpl.current, [refImpl]);

    const content = typeof children === 'function' ? children(refImpl.current) : children;

    return <ctx.Provider value={ctxValue}>{content}</ctx.Provider>;
  });

  return { Tracking };
}
