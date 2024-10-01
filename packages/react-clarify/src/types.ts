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

export type TrackingResolveFn<TBase extends ReactClarifyBase = ReactClarify, TRes = unknown> = (
  data: Readonly<TrackingData<TBase>>,
) => TRes;

export type TrackingResolver<TBase extends ReactClarifyBase = ReactClarify> = (props: TrackingProviderProps<TBase>) => {
  result: TrackingRef<TBase>;
  content: ReactNode;
};

export type TrackingProviderProps<TBase extends ReactClarifyBase = ReactClarify> = {
  enabled?: boolean | TrackingResolveFn<TBase, boolean>;
  skip?: boolean | TrackingResolveFn<TBase, boolean>;
  root?: boolean | TrackingResolveFn<TBase, boolean>;
  data?: Partial<TrackingData<TBase>> | TrackingResolveFn<TBase, TrackingData<TBase>>;
  children?: ReactNode | ((ref: TrackingRef<TBase>) => ReactNode);
};

export interface TrackingContext<TBase extends ReactClarifyBase = ReactClarify> {
  readonly enabled: boolean;
  readonly data: Readonly<TrackingData<TBase>>;
}

export interface TrackingRef<TBase extends ReactClarifyBase = ReactClarify> extends TrackingContext<TBase> {
  readonly track: TrackFn<TBase>;
}

export interface TrackingHandlerContext<TBase extends ReactClarifyBase = ReactClarify> {
  handle: TrackingHandlerFn<TBase>;
}

export interface TrackingHandlerProps<TBase extends ReactClarifyBase = ReactClarify> {
  root?: boolean;
  skip?: boolean;
  onHandle?: TrackingHandlerFn<TBase>;
}

export interface TrackCallbackProps<TBase extends ReactClarifyBase = ReactClarify>
  extends TrackingProviderProps<TBase> {
  name?: string;
  disabled?: boolean;
}

export interface TrackEventProps<TBase extends ReactClarifyBase = ReactClarify> extends TrackingProviderProps<TBase> {
  name?: string;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  disabled?: boolean;
  eventOptions?: boolean | AddEventListenerOptions;
  refProp?: string;
}
