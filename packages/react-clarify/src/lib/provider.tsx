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
  TrackingProviderProps,
  TrackingRef,
} from '../types';

export function createTrackingProvider<TBase extends ReactClarifyBase = ReactClarify>(
  ctx: Context<TrackingContext<TBase>>,
  useTrack: () => TrackFn<TBase>,
) {
  type TData = TrackingData<TBase>;
  type TRef = TrackingRef<TBase>;
  type TProps = TrackingProviderProps<TBase>;
  type TTrackFn = TrackFn<TBase>;

  function useResolvedTracking({ children, enabled, skip, root, data }: TProps) {
    const parentCtx = useContext(ctx);

    const resolvedRoot = typeof root === 'function' ? root(parentCtx.data) : root;

    const baseData = resolvedRoot ? ({} as TData) : parentCtx.data;
    const newData =
      typeof data === 'function'
        ? data(parentCtx.data)
        : ({
            ...baseData,
            ...data,
          } as TData);

    const resolvedSkip = typeof skip === 'function' ? skip(newData) : skip;

    const currentData = resolvedSkip ? baseData : newData;
    const dataRef = useStable(currentData);
    const resolvedEnabled = typeof enabled === 'function' ? enabled(currentData) : enabled;
    const newEnabled = typeof resolvedEnabled === 'boolean' ? resolvedEnabled : parentCtx.enabled;

    const track = useTrack();
    const trackFn = useStableCallback<TTrackFn>(({ args, data }) => track({ data: { ...currentData, ...data }, args }));

    const result = useMemo<TRef>(
      () => ({
        track: trackFn,
        enabled: newEnabled,
        get data() {
          return dataRef.current;
        },
      }),
      [newEnabled, dataRef, trackFn],
    );

    const content = typeof children === 'function' ? children(result) : children;

    return { result, content };
  }

  const TrackingProvider = forwardRef<TRef, TProps>(function _Tracking(props, ref) {
    const { result, content } = useResolvedTracking(props);

    useImperativeHandle(ref, () => result, [result]);

    return <ctx.Provider value={result}>{content}</ctx.Provider>;
  });

  return { TrackingProvider, useResolvedTracking };
}
