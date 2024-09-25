import { Tracking, TrackingHandler, type TrackingHandlerFn, type TrackingProps } from 'react-clarify';
export * as userEvent from '@testing-library/user-event';

export function createTrackingWrapper(defaultProps: TrackingProps = {}) {
  const spy = vi.fn<Parameters<TrackingHandlerFn>>();

  const wrapper = (baseProps: TrackingProps) => {
    const { children, ...props } = { ...defaultProps, ...baseProps };

    return (
      <Tracking {...props}>
        {(ctx) => (
          <TrackingHandler onHandle={spy}>{typeof children === 'function' ? children(ctx) : children}</TrackingHandler>
        )}
      </Tracking>
    );
  };

  return { wrapper, spy };
}
