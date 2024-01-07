import { Context, PropsWithChildren, useContext, useMemo } from 'react';
import { useStable } from '../hooks/use-stable';
import { useStableCallback } from '../hooks/use-stable-callback';
import {
  ReactOn,
  ReactOnBase,
  TrackFn,
  TrackingContext,
  TrackingHandlerContext,
  TrackingHandlerFn,
  TrackingHandlerProps,
  TrackingValues,
} from '../types';

export function createTrackingHandlerProvider<TBase extends ReactOnBase = ReactOn>(
  ctx: Context<TrackingContext<TBase>>,
  handlerCtx: Context<TrackingHandlerContext<TBase>>,
) {
  type THandlerCtx = TrackingHandlerContext<TBase>;
  type TValues = TrackingValues<TBase>;
  type TProps = TrackingHandlerProps<TBase>;
  type THandlerFn = TrackingHandlerFn<TBase>;
  type TTrackFn = TrackFn<TBase>;

  function TrackingHandler({ children, ...props }: PropsWithChildren<TProps>) {
    const propsRef = useStable(props);
    const ctxValue = useContext(handlerCtx);
    const baseHandler = useStableCallback(ctxValue.handle);

    const value = useMemo<THandlerCtx>(
      () => ({
        handle(options) {
          if (!propsRef.current.skip) propsRef.current.onHandle?.(options);
          if (!propsRef.current.root) {
            baseHandler(options);
          }
        },
      }),
      [baseHandler, propsRef],
    );

    return <handlerCtx.Provider value={value}>{children}</handlerCtx.Provider>;
  }

  function ConsoleTrackingHandler({
    message,
    ...props
  }: PropsWithChildren<Omit<TProps, 'onHandle'> & { message?: string }>) {
    const onHandle = useStableCallback<THandlerFn>((options) => {
      console.log(message || 'Tracked', options);
    });

    return <TrackingHandler {...props} onHandle={onHandle} />;
  }

  function useTrack() {
    const handler = useContext(handlerCtx).handle;
    const ctxValue = useContext(ctx);

    return useStableCallback<TTrackFn>((options) => {
      if (ctxValue.enabled) {
        handler({ ...options, values: { ...ctxValue.values, ...options?.values } as TValues });
      }
    });
  }

  return {
    TrackingHandler,
    ConsoleTrackingHandler,
    useTrack,
  };
}
