/**
 * An interface that can be used to override the default tracking type, values.
 */

import { ReactNode } from 'react';

export type SafeString = string & {};

export type DefaultTrackingType = SafeString;
export interface DefaultTrackingValues {
  [key: string]: any;
}

export interface ReactOnBase {
  type?: DefaultTrackingType;
  values?: DefaultTrackingValues;
}

export interface ReactOn extends ReactOnBase {}

export type TrackingType<TBase extends ReactOnBase = ReactOn> = TBase extends { type: infer T }
  ? T
  : DefaultTrackingType;

export type TrackingValues<TBase extends ReactOnBase = ReactOn> = TBase extends { values: infer T }
  ? T
  : DefaultTrackingValues;

export type TrackingHandlerObject<
  TBase extends ReactOnBase = ReactOn,
  TValues = TrackingValues<TBase>,
  TArgs extends unknown[] = unknown[],
> = {
  type: TrackingType<TBase>;
  values: TValues;
  args: TArgs;
};

export type TrackingHandlerFn<TBase extends ReactOnBase = ReactOn> = (
  options: TrackingHandlerObject<TBase, TrackingValues<TBase>>,
) => void;

export type TrackFn<TBase extends ReactOnBase = ReactOn> = (
  options: TrackingHandlerObject<TBase, Partial<TrackingValues<TBase>> | void>,
) => void;

export type TrackingProps<TBase extends ReactOnBase = ReactOn> = {
  enabled?: boolean;
  skip?: boolean;
  root?: boolean;
  values?: Partial<TrackingValues<TBase>>;
  children?: ReactNode | ((ref: TrackingRef<TBase>) => ReactNode);
};

export interface TrackingRef<TBase extends ReactOnBase = ReactOn> {
  modify: (cb: (val: Readonly<Partial<TrackingValues<TBase>>>) => Partial<TrackingValues<TBase>>) => void;
  getValues: () => Partial<TrackingValues<TBase>>;
  track: TrackFn<TBase>;
}

export interface TrackingContext<TBase extends ReactOnBase = ReactOn> {
  readonly enabled: boolean;
  readonly values: Readonly<TrackingValues<TBase>>;
}

export interface TrackingHandlerContext<TBase extends ReactOnBase = ReactOn> {
  handle: TrackingHandlerFn<TBase>;
}

export interface TrackingHandlerProps<TBase extends ReactOnBase = ReactOn> {
  root?: boolean;
  skip?: boolean;
  onHandle?: TrackingHandlerFn<TBase>;
}

export interface TrackCallbackProps<TBase extends ReactOnBase = ReactOn> {
  name?: string;
  values?: Partial<TrackingValues<TBase>>;
  children?: ReactNode;
  disabled?: boolean;
}

export interface TrackEventProps<TBase extends ReactOnBase = ReactOn> {
  name?: string;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  values?: Partial<TrackingValues<TBase>>;
  children?: ReactNode;
  disabled?: boolean;
  eventOptions?: boolean | AddEventListenerOptions;
  refProp?: string;
}
