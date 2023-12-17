declare module 'react/jsx-runtime' {
  export const Fragment: Symbol;
  export const jsx: any;
  export const jsxs: any;
}

import { createMiddlewareContext } from 'react-on';
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';

export function createLocalJsxContext() {
  return createMiddlewareContext(_jsx, _jsxs);
}
