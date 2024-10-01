import { TrackingHandler, type TrackingHandlerFn, TrackingProvider, type TrackingProviderProps } from 'react-clarify';
export * as userEvent from '@testing-library/user-event';

export function createTrackingWrapper(defaultProps: TrackingProviderProps = {}) {
  const spy = vi.fn<Parameters<TrackingHandlerFn>>();

  const wrapper = (baseProps: TrackingProviderProps) => {
    const { children, ...props } = { ...defaultProps, ...baseProps };

    return (
      <TrackingProvider {...props}>
        {(ctx) => (
          <TrackingHandler onHandle={spy}>{typeof children === 'function' ? children(ctx) : children}</TrackingHandler>
        )}
      </TrackingProvider>
    );
  };

  return { wrapper, spy };
}
