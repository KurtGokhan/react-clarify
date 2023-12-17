/**
 * An interface that can be used to override the default tracking type, scope and values.
 */
export interface ReactOn {
  // type: TrackingType;
  // scope: TrackingScope;
  // values: TrackingValues;
}

export type SafeString = string & {};

type DefaultTrackingType = SafeString;
export type TrackingType = ReactOn extends { type: infer T } ? T : DefaultTrackingType;

type DefaultTrackingScope = 'default' | SafeString;
export type TrackingScope = ReactOn extends { scope: infer T } ? T : DefaultTrackingScope;

interface DefaultTrackingValues {
  [key: string]: any;
}
export type TrackingValues = ReactOn extends { values: infer T } ? T : DefaultTrackingValues;

export type TrackingHandlerObject<TValues = TrackingValues, TArgs extends unknown[] = unknown[]> = {
  type: TrackingType;
  scope?: TrackingScope;
  values: TValues;
  args: TArgs;
};

export type TrackingHandlerFn = (options: TrackingHandlerObject) => void;
export type TrackFn = (options: TrackingHandlerObject<Partial<TrackingValues> | void>) => void;
