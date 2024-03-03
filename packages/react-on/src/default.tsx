import { createTrackingContext } from './lib/creator';

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
