import React from 'react';
import { ConsoleTrackingHandler, TrackEvent, TrackingProvider } from 'react-clarify';

export default function Example() {
  return (
    <TrackingProvider data={{ user: { name: 'johndoe', id: '123456' }, company: 'acme' }}>
      <ConsoleTrackingHandler level="info" transform={JSON.stringify}>
        <TrackingProvider data={{ page: 'Home Page' }}>
          <p>Clicking the button will log a message to the console and send a tracking event.</p>

          <TrackEvent event="click" data={{ element: 'My button' }}>
            <button type="button">Click me</button>
          </TrackEvent>
        </TrackingProvider>
      </ConsoleTrackingHandler>
    </TrackingProvider>
  );
}
