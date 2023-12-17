import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import { useTrackingContext } from './context';
import { useLatest } from './hooks/use-latest';
import { TrackFn, TrackingHandlerFn } from './types';

interface TrackingHandlerContext {
  handle: TrackingHandlerFn;
}

const ctx = createContext<TrackingHandlerContext>({ handle: () => { } });
const TrackingHandlerProvider = ctx.Provider;
export const useTrackingHandler = () => useContext(ctx);

interface TrackingHandlerProps {
  root?: boolean;
  skip?: boolean;
  onHandle?: TrackingHandlerFn;
}

export function TrackingHandler({ children, ...props }: PropsWithChildren<TrackingHandlerProps>) {
  const propsRef = useLatest(props);
  const baseHandler = useLatest(useTrackingHandler());

  const value = useMemo<TrackingHandlerContext>(
    () => ({
      handle(options) {
        if (!propsRef.current.skip) propsRef.current.onHandle?.(options);
        if (!propsRef.current.root) {
          baseHandler.current.handle(options);
        }
      },
    }),
    [baseHandler, propsRef],
  );

  return (
    <TrackingHandlerProvider value={value}>
      {children}
    </TrackingHandlerProvider>
  );
}

export function ConsoleTrackingHandler({
  message,
  ...props
}: PropsWithChildren<Omit<TrackingHandlerProps, 'onHandle'> & { message?: string }>) {
  const messageRef = useLatest(message);

  const onHandle = useCallback<TrackingHandlerFn>(
    (options) => {
      console.log(messageRef.current || 'Tracked', options);
    },
    [messageRef],
  );

  return <TrackingHandler {...props} onHandle={onHandle} />;
}

export function useTrack() {
  const handler = useLatest(useTrackingHandler());
  const ctx = useLatest(useTrackingContext());

  return useCallback<TrackFn>(
    (options) => {
      if (ctx.current.enabled) {
        handler.current.handle({ ...options, values: { ...ctx.current.values, ...options?.values } });
      }
    },
    [handler, ctx],
  );
}
