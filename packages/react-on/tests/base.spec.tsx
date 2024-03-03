import { render } from '@testing-library/react';
import { TrackCallback, TrackEvent } from 'src';
import { createTrackingWrapper } from './utils';

describe('react-on', () => {
  describe('track-event', () => {
    test('should work', () => {
      const { wrapper, spy } = createTrackingWrapper({ values: { a: 5, b: 't' } });

      const { getByTestId } = render(
        <TrackEvent event="click">
          <button type="button" data-testid="button">
            Click me
          </button>
        </TrackEvent>,
        { wrapper },
      );

      getByTestId('button').click();

      expect(spy).toHaveBeenCalledWith({
        values: { a: 5, b: 't' },
        args: ['click', expect.objectContaining({})],
      });
    });
  });

  describe('track-callback', () => {
    test('should work', () => {
      const { wrapper, spy } = createTrackingWrapper({ values: { a: 5, b: 't' } });

      const { getByTestId } = render(
        <TrackCallback callback="onClick">
          <button type="button" data-testid="button">
            Click me
          </button>
        </TrackCallback>,
        { wrapper },
      );

      getByTestId('button').click();

      expect(spy).toHaveBeenCalledWith({
        values: { a: 5, b: 't' },
        args: ['onClick', expect.objectContaining({})],
      });
    });
  });
});
