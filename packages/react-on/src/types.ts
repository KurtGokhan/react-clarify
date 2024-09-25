import type { ReactNode } from 'react';

export interface DefaultTrackingValues {
  [key: string]: any;
}

export interface ReactClarifyBase {
  values?: DefaultTrackingValues;
}

/**
 * An interface that can be used to override the default tracking type, values.
 */
export interface ReactClarify extends ReactClarifyBase {}

export type TrackingValues<TBase extends ReactClarifyBase = ReactClarify> = TBase extends { values: infer T }
  ? T
  : DefaultTrackingValues;

export type TrackingHandlerObject<
  TBase extends ReactClarifyBase = ReactClarify,
  TValues = TrackingValues<TBase>,
  TArgs extends unknown[] = unknown[],
> = {
  values: TValues;
  args: TArgs;
};

export type TrackingHandlerFn<TBase extends ReactClarifyBase = ReactClarify> = (
  options: TrackingHandlerObject<TBase, TrackingValues<TBase>>,
) => void;

export type TrackFn<TBase extends ReactClarifyBase = ReactClarify> = (
  options: TrackingHandlerObject<TBase, Partial<TrackingValues<TBase>> | undefined>,
) => void;

export type TrackingProps<TBase extends ReactClarifyBase = ReactClarify> = {
  enabled?: boolean;
  skip?: boolean;
  root?: boolean;
  values?: Partial<TrackingValues<TBase>> | ((parentValues?: Readonly<TrackingValues<TBase>>) => TrackingValues<TBase>);
  children?: ReactNode | ((ref: TrackingRef<TBase>) => ReactNode);
};

export interface TrackingRef<TBase extends ReactClarifyBase = ReactClarify> {
  getValues: () => Partial<TrackingValues<TBase>>;
  track: TrackFn<TBase>;
}

export interface TrackingContext<TBase extends ReactClarifyBase = ReactClarify> {
  readonly enabled: boolean;
  readonly values: Readonly<TrackingValues<TBase>>;
}

export interface TrackingHandlerContext<TBase extends ReactClarifyBase = ReactClarify> {
  handle: TrackingHandlerFn<TBase>;
}

export interface TrackingHandlerProps<TBase extends ReactClarifyBase = ReactClarify> {
  root?: boolean;
  skip?: boolean;
  onHandle?: TrackingHandlerFn<TBase>;
}

export interface TrackCallbackProps<TBase extends ReactClarifyBase = ReactClarify> {
  name?: string;
  values?: Partial<TrackingValues<TBase>>;
  children?: ReactNode;
  disabled?: boolean;
}

export interface TrackEventProps<TBase extends ReactClarifyBase = ReactClarify> {
  name?: string;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  values?: Partial<TrackingValues<TBase>>;
  children?: ReactNode;
  disabled?: boolean;
  eventOptions?: boolean | AddEventListenerOptions;
  refProp?: string;
}
