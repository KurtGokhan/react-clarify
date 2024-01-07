import { PropsWithChildren, useState } from 'react';
import { ConsoleTrackingHandler, TrackCallback, TrackEvent, Tracking } from 'react-on';
import './App.css';

function App({ children }: PropsWithChildren) {
  const [count, setCount] = useState(0);

  return (
    <>
      <ConsoleTrackingHandler>
        <Tracking values={{ test: '5' }}>
          <h1>Vite + React</h1>
          <div className='card'>
            <section>
              Track with <code>TrackEvent</code>:&nbsp;

              <TrackEvent event='click' values={{ count }}>
                <button onClick={() => setCount((count) => count + 1)}>
                  Clicked {count} times
                </button>
              </TrackEvent>
            </section>

            <section>
              Track with <code>TrackCallback</code>:&nbsp;

              <TrackCallback callback='onClick' values={{ count }}>
                <button onClick={() => setCount((count) => count + 1)}>
                  Clicked {count} times
                </button>
              </TrackCallback>
            </section>

            <section>
              Track with <code>Tracking</code>:&nbsp;

              <Tracking>
                {({ track }) => (
                  <button onClick={(ev) => {
                    track({ values: { count }, args: ['second-button-click', ev] });
                    setCount((count) => count + 1);
                  }}>
                    Clicked {count} times
                  </button>
                )}
              </Tracking>
            </section>
          </div>
          <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
          {children}
        </Tracking>
      </ConsoleTrackingHandler>
    </>
  );
}

export default App;
