import { createTrackingContext } from './lib/creator';
export type * from './types';

export const {
  Tracking,
  useTrackingContext,
  TrackingHandler,
  ConsoleTrackingHandler,
  useTrack,
  useTrackingHandler,
  TrackCallback,
  TrackEvent,
} = createTrackingContext();
