import { useState } from 'react';
import { ConsoleTrackingHandler, TrackCallback, TrackEvent, TrackingProvider } from 'react-clarify';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ConsoleTrackingHandler>
        <TrackingProvider data={{ test: '5' }}>
          <h1>Vite + React</h1>
          <div className="card">
            <section>
              Track with <code>TrackEvent</code>:&nbsp;
              <TrackEvent event="click" data={{ count }}>
                <button type="button" onClick={() => setCount((count) => count + 1)}>
                  Clicked {count} times
                </button>
              </TrackEvent>
            </section>

            <section>
              Track with <code>TrackCallback</code>:&nbsp;
              <TrackCallback callback="onClick" data={{ count }}>
                <button type="button" onClick={() => setCount((count) => count + 1)}>
                  Clicked {count} times
                </button>
              </TrackCallback>
            </section>

            <section>
              Track with <code>TrackingProvider</code>:&nbsp;
              <TrackingProvider>
                {({ track }) => (
                  <button
                    type="button"
                    onClick={(ev) => {
                      track({ data: { count }, args: ['second-button-click', ev] });
                      setCount((count) => count + 1);
                    }}
                  >
                    Clicked {count} times
                  </button>
                )}
              </TrackingProvider>
            </section>

            <section>
              Track with <code>JSX Middlewares</code>:&nbsp;
              <button type="button" $trackEvent="click" onClick={() => setCount((count) => count + 1)}>
                Clicked {count} times
              </button>
            </section>
          </div>
        </TrackingProvider>
      </ConsoleTrackingHandler>
    </>
  );
}

export default App;
