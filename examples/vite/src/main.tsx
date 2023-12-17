import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const app = <App />;
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(app);
