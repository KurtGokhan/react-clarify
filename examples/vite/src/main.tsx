import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import 'react-clarify/middlewares';

const app = <App />;
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(app);
