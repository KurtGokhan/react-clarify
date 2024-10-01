/// <reference types="vite/client" />

import type { TrackingAttributes } from 'react-clarify/middlewares';

declare module 'react' {
  interface Attributes extends TrackingAttributes {}
}
