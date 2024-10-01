import type { Context, PropsWithChildren } from 'react';
import { useContext, useMemo } from 'react';
import { useStable } from '../hooks/use-stable';
import { useStableCallback } from '../hooks/use-stable-callback';
import type {
  ReactClarify,
  ReactClarifyBase,
  TrackFn,
  TrackingContext,
  TrackingData,
  TrackingHandlerContext,
  TrackingHandlerFn,
  TrackingHandlerObject,
  TrackingHandlerProps,
} from '../types';

export function createTrackingHandlerProvider<TBase extends ReactClarifyBase = ReactClarify>(
  ctx: Context<TrackingContext<TBase>>,
  handlerCtx: Context<TrackingHandlerContext<TBase>>,
) {
  type THandlerCtx = TrackingHandlerContext<TBase>;
  type TData = TrackingData<TBase>;
  type TProps = TrackingHandlerProps<TBase>;
  type THandlerFn = TrackingHandlerFn<TBase>;
  type TTrackFn = TrackFn<TBase>;
  type TObject = TrackingHandlerObject<TBase, TrackingData<TBase>>;

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
    level = 'log',
    transform,
    ...props
  }: PropsWithChildren<
    Omit<TProps, 'onHandle'> & {
      message?: string;
      level?: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';
      transform?: (data: TObject) => unknown;
    }
  >) {
    const onHandle = useStableCallback<THandlerFn>((options) => {
      console[level](message || 'Tracked', typeof transform === 'function' ? transform(options) : options);
    });

    return <TrackingHandler {...props} onHandle={onHandle} />;
  }

  function useTrack({ data }: { data?: Partial<TData> } = {}) {
    const handler = useContext(handlerCtx).handle;
    const ctxValue = useContext(ctx);

    return useStableCallback<TTrackFn>((options) => {
      if (ctxValue.enabled) {
        handler({ ...options, data: { ...ctxValue.data, ...data, ...options?.data } as TData });
      }
    });
  }

  return {
    TrackingHandler,
    ConsoleTrackingHandler,
    useTrack,
  };
}
