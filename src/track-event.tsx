import { cloneElement, ReactElement, ReactNode, useCallback, useRef } from 'react';
import { isElement } from 'react-is';
import { useTrack } from './handlers';
import { assertType } from './helpers/typing';
import { useCombinedRefs } from './hooks/use-combined-refs';
import { useLatest } from './hooks/use-latest';
import { TrackingScope, TrackingValues } from './types';


interface TrackEventProps {
  name?: string;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  values?: Partial<TrackingValues>;
  scope?: TrackingScope;
  children?: ReactNode;
  disabled?: boolean;
  eventOptions?: boolean | AddEventListenerOptions;
  refProp?: string;
}

export function TrackEvent<EventName extends keyof HTMLElementEventMap>({
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
}: TrackEventProps & { event: EventName }) {
  if (!isElement(children) && !assertType<ReactElement>(children)) {
    throw new Error('Children passed to track directive must be an element with ref');
  }

  const valuesRef = useLatest(values);
  const resolvedName = name ?? event;
  const track = useTrack();
  const handle = useCallback(
    (ev: HTMLElementEventMap[EventName]) => {
      track({ type: resolvedName, values: valuesRef.current, args: [ev], scope });
      if (stopPropagation) ev.stopPropagation();
      if (preventDefault) ev.preventDefault();
    },
    [resolvedName, valuesRef, track, stopPropagation, preventDefault],
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

export function TrackClick(props: TrackEventProps) {
  return <TrackEvent event='click' {...props} />;
}
