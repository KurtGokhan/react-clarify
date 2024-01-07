import { Tracking, TrackingHandler, TrackingHandlerFn, TrackingProps } from 'src';
export * as userEvent from '@testing-library/user-event';

export function createTrackingWrapper(defaultProps: TrackingProps = {}) {
  const spy = jest.fn<void, Parameters<TrackingHandlerFn>>();

  const wrapper = (baseProps: TrackingProps) => {
    const { children, ...props } = { ...defaultProps, ...baseProps };

    return (
      <Tracking {...props}>
        {ctx =>
          <TrackingHandler onHandle={spy}>{typeof children === 'function' ? children(ctx) : children}</TrackingHandler>
        }
      </Tracking>
    );
  };

  return { wrapper, spy };
}
