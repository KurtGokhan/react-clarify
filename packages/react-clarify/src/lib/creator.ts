import { createContext, useContext } from 'react';
import type { ReactClarify, ReactClarifyBase, TrackingContext, TrackingData, TrackingHandlerContext } from '../types';
import { createTrackingHandlerProvider } from './handlers';
import { createTrackingProvider } from './provider';
import { createTrackCallback } from './track-callback';
import { createTrackEvent } from './track-event';

export function createTrackingContext<TBase extends ReactClarifyBase = ReactClarify>() {
  type TContext = TrackingContext<TBase>;
  type THandlerContext = TrackingHandlerContext<TBase>;
  type TData = TrackingData<TBase>;

  const ctx = createContext<TContext>({ enabled: true, data: {} as TData });
  const useTrackingContext = () => useContext(ctx);

  const handlerCtx = createContext<THandlerContext>({ handle: () => {} });
  const useTrackingHandler = () => useContext(handlerCtx);

  const { useTrack, TrackingHandler, ConsoleTrackingHandler } = createTrackingHandlerProvider<TBase>(ctx, handlerCtx);
  const { TrackingProvider, useResolvedTracking } = createTrackingProvider<TBase>(ctx, useTrack);
  const { TrackCallback } = createTrackCallback<TBase>(useResolvedTracking);
  const { TrackEvent } = createTrackEvent<TBase>(useResolvedTracking);

  return {
    TrackingProvider,
    useTrackingContext,
    useTrackingHandler,
    useTrack,
    TrackingHandler,
    ConsoleTrackingHandler,
    TrackCallback,
    TrackEvent,
  } as const;
}
