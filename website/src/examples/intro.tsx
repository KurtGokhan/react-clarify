import React from 'react';
import { ConsoleTrackingHandler, TrackEvent, Tracking } from 'react-on';

export default function Example() {
  return (
    <Tracking values={{ user: { name: 'johndoe', id: '123456' }, company: 'acme' }}>
      <ConsoleTrackingHandler>
        <Tracking values={{ page: 'Home Page' }}>
          Clicking the button will log a message to the console and send a tracking event.
          <TrackEvent event="click">
            <button type="button">Click me</button>
          </TrackEvent>
        </Tracking>
      </ConsoleTrackingHandler>
    </Tracking>
  );
}
