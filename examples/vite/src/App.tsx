import { PropsWithChildren, useState } from 'react';
import { ConsoleTrackingHandler, TrackEvent, Tracking } from 'react-on';
import './App.css';

function App({ children }: PropsWithChildren) {
  const [count, setCount] = useState(0);

  return (
    <>
      <ConsoleTrackingHandler>
        <Tracking values={{ test: '5' }}>
          <h1>Vite + React</h1>
          <div className='card'>
            <TrackEvent event='click' values={{ count }}>
              <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
            </TrackEvent>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
          {children}
        </Tracking>
      </ConsoleTrackingHandler>
    </>
  );
}

export default App;
