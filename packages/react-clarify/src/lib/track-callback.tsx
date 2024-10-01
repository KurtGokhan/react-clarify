import type { DOMAttributes, ReactElement } from 'react';
import { Children, cloneElement, useCallback } from 'react';
import type { ReactClarify, ReactClarifyBase, TrackCallbackProps, TrackingResolver } from '../types';

type CallbackNames<Props> = keyof { [key in keyof Props as key extends `on${string}` ? key : never]: true };

export function createTrackCallback<TBase extends ReactClarifyBase = ReactClarify>(
  useResolver: TrackingResolver<TBase>,
) {
  type TProps = TrackCallbackProps<TBase>;

  function TrackCallback<
    ComponentType = DOMAttributes<any>,
    CallbackName extends PropertyKey = CallbackNames<ComponentType> | (string & {}),
  >({ callback, name, disabled, ...props }: TProps & { callback: CallbackName }) {
    if (!callback) throw new Error('Callback name must be provided');

    const {
      content,
      result: { track },
    } = useResolver(props);

    const children = Children.only(content) as ReactElement;
    if (!children) throw new Error('Children passed to track directive must be an element with ref');

    const resolvedName = name ?? String(callback);
    const originalCallback = children.props[callback];
    const handle = useCallback(
      (...args: any[]) => {
        track({ args: [resolvedName, ...args], data: {} });
        return originalCallback?.(args);
      },
      [originalCallback, track, resolvedName],
    );

    return cloneElement(children, {
      ...children.props,
      [callback]: handle,
    });
  }

  return { TrackCallback };
}
