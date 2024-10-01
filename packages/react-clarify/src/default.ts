import { createTrackingContext } from './lib/creator';
export type * from './types';

export const {
  TrackingProvider,
  useTrackingContext,
  TrackingHandler,
  ConsoleTrackingHandler,
  useTrack,
  useTrackingHandler,
  TrackCallback,
  TrackEvent,
} = createTrackingContext();
