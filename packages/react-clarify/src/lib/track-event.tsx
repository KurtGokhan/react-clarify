import type { ReactElement } from 'react';
import { Children, cloneElement, useCallback, useRef } from 'react';
import { useCombinedRefs } from '../hooks/use-combined-refs';
import { useStableCallback } from '../hooks/use-stable-callback';
import type { ReactClarify, ReactClarifyBase, TrackEventProps, TrackFn } from '../types';

export function createTrackEvent<TBase extends ReactClarifyBase = ReactClarify>(useTrack: () => TrackFn<TBase>) {
  type TProps = TrackEventProps<TBase>;

  function TrackEvent<EventName extends keyof HTMLElementEventMap>({
    children,
    refProp = 'ref',
    event,
    eventOptions,
    name,
    disabled,
    stopPropagation,
    preventDefault,
    data,
  }: TProps & { event: EventName }) {
    children = Children.only(children) as ReactElement;
    if (!children) throw new Error('Children passed to track directive must be an element with ref');

    const resolvedName = name ?? event;
    const track = useTrack();
    const trackFn = useStableCallback((...args: any[]) => track({ data, args: [resolvedName, ...args] }));

    const handle = useCallback(
      (ev: HTMLElementEventMap[EventName], ...args: any[]) => {
        trackFn(ev, ...args);
        if (stopPropagation) ev.stopPropagation();
        if (preventDefault) ev.preventDefault();
      },
      [trackFn, stopPropagation, preventDefault],
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
