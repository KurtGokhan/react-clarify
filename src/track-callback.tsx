import { cloneElement, DOMAttributes, ReactElement, ReactNode, useCallback } from 'react';
import { isElement } from 'react-is';
import { useTrack } from './handlers';
import { assertType } from './helpers/typing';
import { useLatest } from './hooks/use-latest';
import { TrackingScope, TrackingValues } from './types';

type CallbackNames<Props> = keyof { [key in keyof Props as key extends `on${string}` ? key : never]: true };

export interface TrackCallbackProps {
  name?: string;
  values?: Partial<TrackingValues>;
  children?: ReactNode;
  disabled?: boolean;
  scope?: TrackingScope;
}

export function TrackCallback<ComponentType = DOMAttributes<any>, CallbackName extends PropertyKey = CallbackNames<ComponentType> | (string & {})>({
  children,
  callback,
  name,
  disabled,
  scope,
  ...props
}: TrackCallbackProps & { callback: CallbackName }) {
  if (!isElement(children) && !assertType<ReactElement>(children)) {
    throw new Error('Children passed to track directive must be an element with ref');
  }

  if (!callback) {
    throw new Error('Callback name must be provided');
  }

  const valuesRef = useLatest(props.values);
  const resolvedName = name ?? String(callback);
  const track = useTrack();

  const originalCallback = children.props[callback];
  const handle = useCallback(
    (...args: any[]) => {
      track({ type: resolvedName, values: valuesRef.current, args, scope });
      return originalCallback?.(args);
    },
    [resolvedName, valuesRef, track, scope, originalCallback],
  );

  return cloneElement(children, {
    ...children.props,
    [callback]: handle,
  });
}

export function TrackClickCallback(props: TrackCallbackProps) {
  return <TrackCallback callback='onClick' {...props} />;
}
