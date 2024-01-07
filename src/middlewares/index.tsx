import { addMiddlewares } from 'jsx-middlewares/react';
import { TrackCallback, TrackEvent, Tracking } from '../default';
import type { TrackingValues } from '../types';

declare module 'react' {
  interface Attributes {
    $tracking?: TrackingValues;
    $trackCallback?: string;
    $trackEvent?: string;
  }
}

function register() {
  addMiddlewares(
    function trackEventDirective(next, type, { $trackEvent, ...props }, key) {
      if ($trackEvent) {
        return (
          <TrackEvent event={$trackEvent} key={key}>
            {next(type, props, undefined)}
          </TrackEvent>
        );
      }

      return next(type, props, key);
    },
    function trackCallbackDirective(next, type, { $trackCallback, ...props }, key) {
      if ($trackCallback) {
        return (
          <TrackCallback callback={$trackCallback} key={key}>
            {next(type, props, undefined)}
          </TrackCallback>
        );
      }

      return next(type, props, key);
    },
    function trackingDirective(next, type, { $tracking, ...props }, key) {
      if ($tracking) {
        return (
          <Tracking values={$tracking} key={key}>
            {next(type, props, undefined)}
          </Tracking>
        );
      }

      return next(type, props, key);
    },
  );
}

register();
