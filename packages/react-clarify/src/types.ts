import type { ReactNode } from 'react';

export interface DefaultTrackingData {
  [key: string]: any;
}

export interface ReactClarifyBase {
  data?: DefaultTrackingData;
}

/**
 * An interface that can be used to override the default tracking type and data.
 */
export interface ReactClarify extends ReactClarifyBase {}

export type TrackingData<TBase extends ReactClarifyBase = ReactClarify> = TBase extends { data: infer T }
  ? T
  : DefaultTrackingData;

export type TrackingHandlerObject<
  TBase extends ReactClarifyBase = ReactClarify,
  TData = TrackingData<TBase>,
  TArgs extends unknown[] = unknown[],
> = {
  data: TData;
  args: TArgs;
};

export type TrackingHandlerFn<TBase extends ReactClarifyBase = ReactClarify> = (
  options: TrackingHandlerObject<TBase, TrackingData<TBase>>,
) => void;

export type TrackFn<TBase extends ReactClarifyBase = ReactClarify> = (
  options: TrackingHandlerObject<TBase, Partial<TrackingData<TBase>> | undefined>,
) => void;

export type TrackingProps<TBase extends ReactClarifyBase = ReactClarify> = {
  enabled?: boolean;
  skip?: boolean;
  root?: boolean;
  data?: Partial<TrackingData<TBase>> | ((parentData?: Readonly<TrackingData<TBase>>) => TrackingData<TBase>);
  children?: ReactNode | ((ref: TrackingRef<TBase>) => ReactNode);
};

export interface TrackingRef<TBase extends ReactClarifyBase = ReactClarify> {
  getData: () => Partial<TrackingData<TBase>>;
  track: TrackFn<TBase>;
}

export interface TrackingContext<TBase extends ReactClarifyBase = ReactClarify> {
  readonly enabled: boolean;
  readonly data: Readonly<TrackingData<TBase>>;
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
  data?: Partial<TrackingData<TBase>>;
  children?: ReactNode;
  disabled?: boolean;
}

export interface TrackEventProps<TBase extends ReactClarifyBase = ReactClarify> {
  name?: string;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  data?: Partial<TrackingData<TBase>>;
  children?: ReactNode;
  disabled?: boolean;
  eventOptions?: boolean | AddEventListenerOptions;
  refProp?: string;
}
