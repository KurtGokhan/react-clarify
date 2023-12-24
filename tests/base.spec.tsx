import { render } from '@testing-library/react';
import { TrackEvent, Tracking, TrackingHandler, TrackingHandlerFn } from 'src';

describe('react-on', () => {
  test('should work', () => {
    const spy = jest.fn<void, Parameters<TrackingHandlerFn>>();

    const { getByTestId } = render(<Tracking values={{ a: 5, b: 't' }}>
      <TrackingHandler onHandle={spy}>
        <TrackEvent event='click'>
          <button data-testid="test">Click me</button>
        </TrackEvent>
      </TrackingHandler>
    </Tracking>)

    const button = getByTestId('test');
    button.click();

    expect(spy).toHaveBeenCalledWith({ values: { a: 5, b: 't' }, type: 'click', args: [expect.objectContaining({})] });
  });
});
