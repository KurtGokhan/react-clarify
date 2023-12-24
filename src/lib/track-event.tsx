import { cloneElement, ReactElement, useCallback, useRef } from 'react';
import { isElement } from 'react-is';
import { assertType } from '../helpers/typing';
import { useCombinedRefs } from '../hooks/use-combined-refs';
import { useCurrentCallback } from '../hooks/use-current-callback';
import { ReactOn, ReactOnBase, TrackEventProps, TrackFn, TrackingType } from '../types';

export function createTrackEvent<TBase extends ReactOnBase = ReactOn>(useTrack: () => TrackFn<TBase>) {
  type TType = TrackingType<TBase>;
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
    values,
    scope,
  }: TProps & { event: EventName }) {
    if (!isElement(children) && !assertType<ReactElement>(children)) {
      throw new Error('Children passed to track directive must be an element with ref');
    }

    const resolvedName = (name ?? event) as TType;
    const track = useTrack();
    const trackFn = useCurrentCallback((ev: HTMLElementEventMap[EventName]) =>
      track({ type: resolvedName, values: values, args: [ev], scope }),
    );
    const handle = useCallback(
      (ev: HTMLElementEventMap[EventName]) => {
        trackFn(ev);
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
