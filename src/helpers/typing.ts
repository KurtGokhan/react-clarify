export function assertType<Assertion>(v: any, callback?: (val: Assertion) => boolean): v is Assertion {
  if (typeof callback === 'function') return callback(v);
  return true;
}
