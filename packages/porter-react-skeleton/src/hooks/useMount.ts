import { EffectCallback, useEffect } from 'react';

/**
 * @param fn - function, which is triggered on mount. If the function returns a callback, it will be called on unmount.
 */
const useMount = (fn: EffectCallback): void => {
  useEffect(fn, []);
};

export default useMount;
