import { cloneElement, DOMAttributes, ReactElement, useCallback } from 'react';
import { isElement } from 'react-is';
import { assertType } from '../helpers/typing';
import { useCurrentCallback } from '../hooks/use-current-callback';
import { ReactOn, ReactOnBase, TrackCallbackProps, TrackFn, TrackingType } from '../types';

type CallbackNames<Props> = keyof { [key in keyof Props as key extends `on${string}` ? key : never]: true };

export function createTrackCallback<TBase extends ReactOnBase = ReactOn>(useTrack: () => TrackFn<TBase>) {
  type TType = TrackingType<TBase>;
  type TProps = TrackCallbackProps<TBase>;

  function TrackCallback<
    ComponentType = DOMAttributes<any>,
    CallbackName extends PropertyKey = CallbackNames<ComponentType> | (string & {}),
  >({ children, callback, name, disabled, ...props }: TProps & { callback: CallbackName }) {
    if (!isElement(children) && !assertType<ReactElement>(children)) {
      throw new Error('Children passed to track directive must be an element with ref');
    }

    if (!callback) {
      throw new Error('Callback name must be provided');
    }

    const resolvedName = (name ?? String(callback)) as TType;
    const track = useTrack();

    const trackFn = useCurrentCallback((...args: any[]) =>
      track({ type: resolvedName, values: props.values, args }),
    );

    const originalCallback = children.props[callback];
    const handle = useCallback(
      (...args: any[]) => {
        trackFn(...args);
        return originalCallback?.(args);
      },
      [originalCallback, trackFn],
    );

    return cloneElement(children, {
      ...children.props,
      [callback]: handle,
    });
  }

  return { TrackCallback };
}
