import type { ReactElement } from 'react';
import { Children, cloneElement, useCallback, useRef } from 'react';
import { useCombinedRefs } from '../hooks/use-combined-refs';
import type { ReactClarify, ReactClarifyBase, TrackEventProps, TrackingResolver } from '../types';

export function createTrackEvent<TBase extends ReactClarifyBase = ReactClarify>(useResolver: TrackingResolver<TBase>) {
  type TProps = TrackEventProps<TBase>;

  function TrackEvent<EventName extends keyof HTMLElementEventMap>({
    refProp = 'ref',
    event,
    eventOptions,
    name,
    disabled,
    stopPropagation,
    preventDefault,
    ...props
  }: TProps & { event: EventName }) {
    const {
      content,
      result: { track },
    } = useResolver(props);

    const children = Children.only(content) as ReactElement;
    if (!children) throw new Error('Children passed to track directive must be an element with ref');

    const resolvedName = name ?? event;
    const handle = useCallback(
      (ev: HTMLElementEventMap[EventName], ...args: any[]) => {
        track({ args: [resolvedName, ev, ...args], data: {} });
        if (stopPropagation) ev.stopPropagation();
        if (preventDefault) ev.preventDefault();
      },
      [track, stopPropagation, preventDefault, resolvedName],
    );

    const cleanupRef = useRef<() => void>();
    const eventRef = useCallback(
      (el: HTMLElement | null) => {
        cleanupRef.current?.();
        cleanupRef.current = undefined;

        if (disabled || typeof el?.addEventListener !== 'function') return;

        el.addEventListener(event, handle, eventOptions);
        cleanupRef.current = () => el.removeEventListener(event, handle, eventOptions);
      },
      [event, handle, disabled, eventOptions],
    );
    const mergedRef = useCombinedRefs(eventRef, (children as any)[refProp]);

    return cloneElement(children, {
      ...children.props,
      [refProp]: mergedRef,
    });
  }

  return { TrackEvent };
}
